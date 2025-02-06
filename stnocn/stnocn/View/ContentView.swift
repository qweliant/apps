//
//  ContentView.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var notesViewModel: NotesViewModel

    var body: some View {
        Group {
            if notesViewModel.isDataLoaded {
                NotesView()
            } else {
                VStack {
                    ProgressView("Loading...")
                    if let error = notesViewModel.loadError {
                        Text("Error: \(error)")
                            .foregroundColor(.red)
                            .padding()
                    }
                }
            }
        }    }
}

#Preview {
    ContentView()
        .environmentObject(NotesViewModel(manager: CoreDataManager.shared))
}
