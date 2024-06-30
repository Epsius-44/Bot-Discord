use chrono::{Datelike, NaiveDate};
use rayon::prelude::*;

pub struct EdtElement {
    pub name: Option<String>,
    pub room: Option<String>,
    pub teacher: Option<String>,
    pub date: NaiveDate,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
}

// Fonction de récupération des cours d'une journée
pub fn get_day(search_date: NaiveDate, search_user: String) -> Vec<EdtElement> {
    let query_date = search_date.format("%m/%d/%Y").to_string();
    // Initialisation de la liste des éléments de l'emploi du temps
    let mut edt_elements: Vec<EdtElement> = Vec::new();
    // Récupération du contenu HTML de la page
    let response = reqwest::blocking::get(format!("https://edtmobiliteng.wigorservices.net/WebPsDyn.aspx?Action=posETUD&serverid=C&Tel={search_user}&date={query_date}%208:00"));
    match response {
        Ok(_) => {
            let html_content = response.unwrap().text().unwrap();
            let document = scraper::Html::parse_document(&html_content);
            // Extraction des éléments de l'emploi du temps (cours)
            let html_product_selector = scraper::Selector::parse("div.Ligne").unwrap();
            let html_products = document.select(&html_product_selector);
            // Traitement de chaque élément de l'emploi du temps
            for html_product in html_products {
                let name = html_product
                    .select(&scraper::Selector::parse("div.Matiere").unwrap())
                    .next()
                    .map(|div| div.text().collect::<String>());
                let room = html_product
                    .select(&scraper::Selector::parse("div.Salle").unwrap())
                    .next()
                    .map(|div| div.text().collect::<String>());
                let teacher = html_product
                    .select(&scraper::Selector::parse("div.Prof").unwrap())
                    .next()
                    .map(|div| div.text().collect::<String>());
                let date = search_date;
                let start_time = html_product
                    .select(&scraper::Selector::parse("div.Debut").unwrap())
                    .next()
                    .map(|div| div.text().collect::<String>());
                let end_time = html_product
                    .select(&scraper::Selector::parse("div.Fin").unwrap())
                    .next()
                    .map(|div| div.text().collect::<String>());
                // Création d'un élément de l'emploi du temps
                let edt_element = EdtElement {
                    name,
                    room: match room {
                        Some(room) => {
                            if room.starts_with("SALLE_") {
                                Some("DISTANCIEL".to_string())
                            } else {
                                Some(room)
                            }
                        }
                        None => None,
                    },
                    date,
                    teacher,
                    start_time,
                    end_time,
                };
                // Ajout de l'élément à la liste
                edt_elements.push(edt_element);
            }
            if edt_elements.is_empty() {
                edt_elements.push(EdtElement {
                    name: None,
                    room: None,
                    date: search_date,
                    teacher: None,
                    start_time: None,
                    end_time: None,
                });
            }
        }
        Err(err) => {
            edt_elements.push(EdtElement {
                name: "Impossible de récupérer l'emploi du temps".parse().ok(),
                room: "ERROR001".parse().ok(),
                date: search_date,
                teacher: err.to_string().parse().ok(),
                start_time: "00:00".parse().ok(),
                end_time: "23:59".parse().ok(),
            });
        }
    }
    return edt_elements;
}

// Fonction de récupération des cours entre deux dates
pub fn get_edt_elements(
    begin_date: NaiveDate,
    end_date: NaiveDate,
    user: String,
) -> Vec<Vec<EdtElement>> {
    // Récupération des dates entre begin et end
    let mut dates: Vec<NaiveDate> = Vec::new();
    let mut current_date = begin_date;
    while current_date <= end_date {
        if current_date.weekday() != chrono::Weekday::Sat
            && current_date.weekday() != chrono::Weekday::Sun
        {
            dates.push(current_date);
        }
        current_date += chrono::Duration::try_days(1).unwrap();
    }
    #[allow(clippy::clone_on_copy)]
    // Récupération des cours
    let results: Vec<_> = dates
        .par_iter()
        .map(|date| get_day(date.clone(), user.clone()))
        .collect();
    return results;
}
