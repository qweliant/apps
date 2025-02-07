//
//  NotesView.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI
import CoreData

struct NotesView: View {
    @EnvironmentObject var vm: NotesViewModel
    @State private var searchText = ""
    @State private var selectedNote: NoteEntity?
    @State private var groupedByDate: [Date: [NoteEntity]] = [:]
    @State private var headers: [Date] = []

    var body: some View {
        NavigationSplitView {
            VStack {
                Text("""
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⡤⠤⠤⠤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠞⠋⠁⠀⠀⠀⠀⠀⠀⠀⠉⠛⢦⣤⠶⠦⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⣴⠞⢋⡽⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠃⠀⠀⠙⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣰⠟⠁⠀⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡀⠀⠀⠉⠓⠦⣤⣤⣤⣤⣤⣤⣄⣀⠀⠀⠀
⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣷⡄⠀⠀⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣆⠀
⠀⠀⣠⠞⠁⠀⠀⣀⣠⣏⡀⠀⢠⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠿⡃⠀⠀⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡆
⢀⡞⠁⠀⣠⠶⠛⠉⠉⠉⠙⢦⡸⣿⡿⠀⠀⠀⡄⢀⣀⣀⡶⠀⠀⠀⢀⡄⣀⠀⣢⠟⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠃
⡞⠀⠀⠸⠁⠀⠀⠀⠀⠀⠀⠀⢳⢀⣠⠀⠀⠀⠉⠉⠀⠀⣀⠀⠀⠀⢀⣠⡴⠞⠁⠀⠀⠈⠓⠦⣄⣀⠀⠀⠀⠀⣀⣤⠞⠁⠀
⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠀⠁⠀⢀⣀⣀⡴⠋⢻⡉⠙⠾⡟⢿⣅⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠉⠉⠀⠀⠀⠀
⠘⣦⡀⠀⠀⠀⠀⠀⠀⣀⣤⠞⢉⣹⣯⣍⣿⠉⠟⠀⠀⣸⠳⣄⡀⠀⠀⠙⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠈⠙⠒⠒⠒⠒⠚⠋⠁⠀⡴⠋⢀⡀⢠⡇⠀⠀⠀⠀⠃⠀⠀⠀⠀⠀⢀⡾⠋⢻⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⢸⡀⠸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣇⠀⠀⠉⠋⠻⣄⠀⠀⠀⠀⠀⣀⣠⣴⠞⠋⠳⠶⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⠦⢤⠤⠶⠋⠙⠳⣆⣀⣈⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
""")
                .font(.system(size: 10, weight: .bold))
                .foregroundStyle(
                    Color.black
                
                )

                List(selection: $selectedNote) {
                    ForEach(headers, id: \.self) { header in
                        Section(header: Text(header, style: .date)) {
                            ForEach(groupedByDate[header]!) { note in
                                NavigationLink(value: note) {
                                    ListCellView(note: note)
                                }
                                .listRowBackground(Color.accent)
                            }
                            .onDelete(perform: { indexSet in
                                deleteNote(in: header, at: indexSet)
                            })
                        }
                    }.background(Color.accent)
                    
                }
                .listStyle(.plain)
                .background(Color.accent)
                .padding()
            }
            .background(Color.accent)
            .navigationTitle("Bitch U Betta Think 🫰🏾")
            .foregroundColor(.pink)
            .searchable(text: $searchText)
            .onChange(of: searchText) { oldValue, newValue in
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    if newValue == searchText {
                        vm.searchNotes(with: newValue)
                    }
                }
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        createNewNote()
                    } label: {
                        Image(systemName: "note.text.badge.plus")
                            .foregroundColor(Color.teal.opacity(0.78))
                    }
                }
            }
            .onChange(of: vm.notes) { _, _ in
                updateGroupedNotes()
            }
            .onAppear {
                updateGroupedNotes()
            }
        } detail: {
            if let selectedNote {
                EditNotesView(note: selectedNote)
            } else {
                Text("Select a Note.")
            }
        }
        
    }

    private func updateGroupedNotes() {
        let calendar = Calendar.current
        let grouped = Dictionary(grouping: vm.notes) { noteEntity in
            let dateComponents = calendar.dateComponents([.year, .month, .day], from: noteEntity.timestamp!)
            return calendar.date(from: dateComponents) ?? Date()
        }
        groupedByDate = grouped
        headers = grouped.map { $0.key }.sorted(by: { $0 > $1 })
    }

    private func createNewNote() {
        selectedNote = nil
        DispatchQueue.global(qos: .userInitiated).async {
            let newNote = vm.createNote()
            DispatchQueue.main.async {
                selectedNote = newNote
            }
        }
    }

    private func deleteNote(in header: Date, at offsets: IndexSet) {
        offsets.forEach { index in
            if let noteToDelete = groupedByDate[header]?[index] {
                if noteToDelete == selectedNote {
                    selectedNote = nil
                }
                DispatchQueue.global(qos: .userInitiated).async {
                    vm.deleteNote(noteToDelete)
                }
            }
        }
    }
}
