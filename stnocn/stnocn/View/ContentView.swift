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
                ProgressView("Loading...")
            }
        }
    }
}

#Preview {
    ContentView()
}
