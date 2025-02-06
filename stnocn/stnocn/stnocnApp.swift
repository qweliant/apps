//
//  stnocnApp.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

@main
struct stnocnApp: App {
    @StateObject var notesViewModel: NotesViewModel

    init() {
       // Use the shared instance of CoreDataManager
       let viewModel = NotesViewModel(manager: CoreDataManager.shared)
       _notesViewModel = StateObject(wrappedValue: viewModel)
    }

    var body: some Scene {
       WindowGroup {
           ContentView()
               .environmentObject(notesViewModel)
       }
    }
}
