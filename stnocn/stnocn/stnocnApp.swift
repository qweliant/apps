//
//  stnocnApp.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

@main
struct stnocnApp: App {
    let coreDataManager = CoreDataManager()
    @StateObject var notesViewModel: NotesViewModel

        init() {
            let viewModel = NotesViewModel(manager: coreDataManager)
            _notesViewModel = StateObject(wrappedValue: viewModel)
        }


    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(notesViewModel)
        }
    }
}
