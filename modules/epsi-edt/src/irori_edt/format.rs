use neon::prelude::*;
use crate::irori_edt::scraper::EdtElement;

pub fn vec_edtelement_to_js_array(mut cx: FunctionContext, lessons: Vec<EdtElement>) -> JsResult<JsArray> {
    let lessons_info = cx.empty_array();
    for lesson in lessons {
        let lesson_obj = cx.empty_object();
        let name = cx.string(&lesson.name.unwrap_or("Aucun cours n'a été trouvé".to_string()));
        lesson_obj.set(&mut cx, "name", name)?;
        let room = cx.string(&lesson.room.unwrap_or("".to_string()));
        lesson_obj.set(&mut cx, "room", room)?;
        let date = cx.string(&lesson.date.to_string());
        lesson_obj.set(&mut cx, "date", date)?;
        let teacher = cx.string(&lesson.teacher.unwrap_or("".to_string()));
        lesson_obj.set(&mut cx, "teacher", teacher)?;
        let start_time = cx.string(&lesson.start_time.unwrap_or("08:00".to_string()));
        lesson_obj.set(&mut cx, "start_time", start_time)?;
        let end_time = cx.string(&lesson.end_time.unwrap_or("20:00".to_string()));
        lesson_obj.set(&mut cx, "end_time", end_time)?;
        let len = lessons_info.len(&mut cx);
        lessons_info.set(&mut cx, len, lesson_obj)?;
    }
    return Ok(lessons_info);
}

pub fn vec_vec_edtelement_to_js_array(mut cx: FunctionContext, all_lessons: Vec<Vec<EdtElement>>) -> JsResult<JsArray> {
    let lessons_info = cx.empty_array();
    for day_lessons in all_lessons {
        let day_info = cx.empty_array();
        for lesson in day_lessons {
            let lesson_obj = cx.empty_object();
            let name = cx.string(&lesson.name.unwrap_or("Aucun cours n'a été trouvé".to_string()));
            lesson_obj.set(&mut cx, "name", name)?;
            let room = cx.string(&lesson.room.unwrap_or("".to_string()));
            lesson_obj.set(&mut cx, "room", room)?;
            let date = cx.string(&lesson.date.to_string());
            lesson_obj.set(&mut cx, "date", date)?;
            let teacher = cx.string(&lesson.teacher.unwrap_or("".to_string()));
            lesson_obj.set(&mut cx, "teacher", teacher)?;
            let start_time = cx.string(&lesson.start_time.unwrap_or("08:00".to_string()));
            lesson_obj.set(&mut cx, "start_time", start_time)?;
            let end_time = cx.string(&lesson.end_time.unwrap_or("20:00".to_string()));
            lesson_obj.set(&mut cx, "end_time", end_time)?;
            let len = day_info.len(&mut cx);
            day_info.set(&mut cx, len, lesson_obj)?;
        }
        let len = lessons_info.len(&mut cx);
        lessons_info.set(&mut cx, len, day_info)?;
    }
    return Ok(lessons_info);
}