// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf};

use serde_json::json;
use tauri::{api::dialog::FileDialogBuilder, CustomMenuItem, Menu, Submenu, WindowMenuEvent};

#[tauri::command]
fn echo(content: &str) -> String {
    content.to_string()
}

fn invoke_file(file_path: PathBuf) -> String {
    fs::read_to_string(file_path).unwrap()
}

fn main() {
    let new = CustomMenuItem::new("new".to_string(), "新規作成(new)");
    let open = CustomMenuItem::new("open".to_string(), "開く(open)");
    let save = CustomMenuItem::new("save".to_string(), "保存(save)");
    let save_with_name = CustomMenuItem::new(
        "save_with_name".to_string(),
        "名前を付けて保存(save file with name)",
    );
    let quit = CustomMenuItem::new("quit".to_string(), "終了(quit)");
    let close = CustomMenuItem::new("close".to_string(), "閉じる(close)");
    let submenu_file = Submenu::new(
        "File",
        Menu::new()
            .add_item(new)
            .add_item(open)
            .add_item(save)
            .add_item(save_with_name)
            .add_item(quit)
            .add_item(close),
    );
    let menu = Menu::new().add_submenu(submenu_file);
    let menu_event_handler = |event: WindowMenuEvent| match event.menu_item_id() {
        "new" => {
            todo!();
        }
        "open" => {
            FileDialogBuilder::new()
                .add_filter("Trees", &["tr"])
                .pick_file(move |file_path| {
                    if let Some(path) = file_path {
                        let content = invoke_file(path.clone());
                        println!("{content}");
                        let payload = json!({
                            "content": content,
                            "path": path.to_string_lossy()
                        });
                        event
                            .window()
                            .emit("open_file", payload)
                            .expect("emit failed");
                    }
                });
        }
        "save" => FileDialogBuilder::new().save_file(|_file_path| {}),
        "save_with_name" => {
            todo!();
        }
        "quit" => {
            std::process::exit(0);
        }
        "close" => {
            event.window().close().unwrap();
        }
        _ => {}
    };
    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(menu_event_handler)
        .invoke_handler(tauri::generate_handler![echo])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
