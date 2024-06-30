use neon::prelude::*;
use redis::{Commands};

const ONLINE_LISTS_TTL : i64 = 150;

struct ClusterMember {
    id: String,
    name: String,
    bot_version: String,
    node_version: String,
    is_online: bool,
    is_master: bool,
}

impl ClusterMember {
    fn to_object<'a>(&self, cx: &mut FunctionContext<'a>) -> JsResult<'a, JsObject> {
        let obj = cx.empty_object();
        let id = cx.string(&self.id);
        obj.set(cx, "id", id)?;
        let name = cx.string(&self.name);
        obj.set(cx, "name", name)?;
        let bot_version = cx.string(&self.bot_version);
        obj.set(cx, "botVersion", bot_version)?;
        let node_version = cx.string(&self.node_version);
        obj.set(cx, "nodeVersion", node_version)?;
        let is_online = cx.boolean(self.is_online);
        obj.set(cx, "isOnline", is_online)?;
        let is_master = cx.boolean(self.is_master);
        obj.set(cx, "isMaster", is_master)?;
        Ok(obj)
    }
}

fn is_connected(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let redis_uri = cx.argument::<JsString>(0)?;
    let client = redis::Client::open(redis_uri.value(&mut cx)).unwrap();
    let con = client.get_connection_with_timeout(std::time::Duration::from_secs(5));
    Ok(cx.boolean(con.is_ok()))
}

fn set_instance_data(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let redis_uri = cx.argument::<JsString>(0)?;
    let bot_id = cx.argument::<JsString>(1)?;
    let instance_id = cx.argument::<JsString>(2)?;
    let instance_name = cx.argument::<JsString>(3)?;
    let instance_version = cx.argument::<JsString>(4)?;
    let node_version = cx.argument::<JsString>(5)?;
    let client = redis::Client::open(redis_uri.value(&mut cx)).unwrap();
    let mut con = client.get_connection_with_timeout(std::time::Duration::from_secs(5)).unwrap();
    con.hset_multiple::<String, &str, String, String>(
        format!("{}:instances:{}", bot_id.value(&mut cx), instance_id.value(&mut cx)),
        &[
            ("name", instance_name.value(&mut cx)),
            ("bot_version", instance_version.value(&mut cx)),
            ("node_version", node_version.value(&mut cx)),
        ],
    ).expect("TODO: panic message");
    Ok(cx.undefined())
}

fn lookup(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let redis_uri = cx.argument::<JsString>(0)?;
    let bot_id = cx.argument::<JsString>(1)?;
    let instance_id = cx.argument::<JsString>(2)?;
    let client = redis::Client::open(redis_uri.value(&mut cx)).unwrap();
    let mut con = client.get_connection_with_timeout(std::time::Duration::from_secs(5)).unwrap();
    // Complete the online lists that control HA
    let mut keys: Vec<String> = con.keys(format!("{}:online:lists:*", bot_id.value(&mut cx))).unwrap();
    keys.sort();
    match keys.len() {
        0 => {
            let _ = con.sadd::<String, String, String>(format!("{}:online:lists:0", bot_id.value(&mut cx)), instance_id.value(&mut cx));
            let _ = con.sadd::<String, String, String>(format!("{}:online:lists:1", bot_id.value(&mut cx)), instance_id.value(&mut cx));
            let _ = con.expire::<String, i64>(format!("{}:online:lists:0", bot_id.value(&mut cx)), ONLINE_LISTS_TTL * 1);
            let _ = con.expire::<String, i64>(format!("{}:online:lists:1", bot_id.value(&mut cx)), ONLINE_LISTS_TTL * 2);
        },
        1 => {
            let _ = con.sadd::<String, String, String>(keys[0].clone(), instance_id.value(&mut cx));
            let actual_ttl = con.ttl::<String, i64>(keys[0].clone());
            let next_name = keys[0].clone().replace(& format!("{}:online:lists:", bot_id.value(&mut cx)), "").parse::<i64>().unwrap() + 1;
            let _ = con.sadd::<String, String, String>(format!("{}:online:lists:{}", bot_id.value(&mut cx), next_name), instance_id.value(&mut cx));
            let _ = con.expire::<String, i64>(format!("{}:online:lists:{}", bot_id.value(&mut cx), next_name), actual_ttl.unwrap() + ONLINE_LISTS_TTL);
        },
        _ => {
            for key in keys.clone() {
                let _ = con.sadd::<String, String, String>(key, instance_id.value(&mut cx));
            }
        }
    }
    // Check if the master is in online:lists
    let master_exist = con.exists::<String,bool>(format!("{}:online:master", bot_id.value(&mut cx))).unwrap();
    if master_exist {
        let master_id = con.get::<String, String>(format!("{}:online:master", bot_id.value(&mut cx))).unwrap();
        let master_in_list = con.sismember::<String, String, bool>(keys[0].clone(), master_id.clone()).unwrap();
        if !master_in_list {
            let _ = con.set::<String, String, String>(format!("{}:online:master", bot_id.value(&mut cx)), instance_id.value(&mut cx));
            let _ = con.expire::<String, i64>(format!("{}:online:master", bot_id.value(&mut cx)), ONLINE_LISTS_TTL * 1);
            std::env::set_var("LZLHA_IS_MASTER", "true");
        } else {
            if master_id == instance_id.value(&mut cx) {
                let _ = con.expire::<String, i64>(format!("{}:online:master", bot_id.value(&mut cx)), ONLINE_LISTS_TTL * 1);
                std::env::set_var("LZLHA_IS_MASTER", "true");
            } else {
                std::env::set_var("LZLHA_IS_MASTER", "false");
                return Ok(cx.boolean(false));
            }
        }
    } else {
        let _ = con.set::<String, String, String>(format!("{}:online:master", bot_id.value(&mut cx)), instance_id.value(&mut cx));
        let _ = con.expire::<String, i64>(format!("{}:online:master", bot_id.value(&mut cx)), ONLINE_LISTS_TTL * 1);
        std::env::set_var("LZLHA_IS_MASTER", "true");
    }
    Ok(cx.boolean(true))
}

fn get_cluster_info(mut cx: FunctionContext) -> JsResult<JsArray> {
    let redis_uri = cx.argument::<JsString>(0)?;
    let bot_id = cx.argument::<JsString>(1)?;
    let client = redis::Client::open(redis_uri.value(&mut cx)).unwrap();
    let mut con = client.get_connection_with_timeout(std::time::Duration::from_secs(5)).unwrap();
    let keys: Vec<String> = con.keys(format!("{}:instances:*", bot_id.value(&mut cx))).unwrap();
    let master_id = con.get::<String, String>(format!("{}:online:master", bot_id.value(&mut cx))).unwrap();
    let cluster_info = cx.empty_array();
    for key in keys {
        let id = key.clone().replace(& format!("{}:instances:", bot_id.value(&mut cx)), "");
        let name = con.hget::<String, &str, String>(key.clone(), "name").unwrap();
        let bot_version = con.hget::<String, &str, String>(key.clone(), "bot_version").unwrap();
        let node_version = con.hget::<String, &str, String>(key.clone(), "node_version").unwrap();
        let mut online_keys: Vec<String> = con.keys(format!("{}:online:lists:*", bot_id.value(&mut cx))).unwrap();
        online_keys.sort();
        let is_online = con.sismember::<String, String, bool>(online_keys[0].clone(), id.clone()).unwrap();
        let is_master = if id.clone() == master_id { true } else { false };
        let cluster_member = ClusterMember {
            id,
            name,
            bot_version,
            node_version,
            is_online,
            is_master,
        };
        let len = cluster_info.len(&mut cx);
        let obj = cluster_member.to_object(&mut cx).unwrap();
        cluster_info.set(&mut cx, len, obj).expect("TODO: panic message");
    }
    Ok(cluster_info)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("isConnected", is_connected)?;
    cx.export_function("setInstanceData", set_instance_data)?;
    cx.export_function("lookup", lookup)?;
    cx.export_function("getClusterInfo", get_cluster_info)?;
    Ok(())
}
