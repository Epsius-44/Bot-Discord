pub mod irori_edt;
use neon::prelude::*;
use irori_edt::scraper::EdtElement;
use chrono::{NaiveDate};

fn get_day(mut cx: FunctionContext) -> JsResult<JsArray> {
    let edt_login = cx.argument::<JsString>(0)?;
    let edt_date = cx.argument::<JsString>(1)?.value(&mut cx);
    let date_format = "%d/%m/%Y";
    let begin_date = NaiveDate::parse_from_str(&edt_date, date_format).expect("Invalid date format");
    let lessons : Vec<EdtElement> = irori_edt::scraper::get_day(begin_date, edt_login.value(&mut cx));
    Ok(irori_edt::format::vec_edtelement_to_js_array(cx, lessons)?)
}

fn get_days(mut cx: FunctionContext) -> JsResult<JsArray> {
    let edt_login = cx.argument::<JsString>(0)?;
    let edt_begin = cx.argument::<JsString>(1)?.value(&mut cx);
    let edt_end = cx.argument::<JsString>(2)?.value(&mut cx);
    let date_format = "%d/%m/%Y";
    let begin_date = NaiveDate::parse_from_str(&edt_begin, date_format).expect("Invalid date format");
    let end_date = NaiveDate::parse_from_str(&edt_end, date_format).expect("Invalid date format");
    let lessons : Vec<Vec<EdtElement>> = irori_edt::scraper::get_edt_elements(begin_date, end_date, edt_login.value(&mut cx));
    Ok(irori_edt::format::vec_vec_edtelement_to_js_array(cx, lessons)?)
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getDay", get_day)?;
    cx.export_function("getDays", get_days)?;
    Ok(())
}
