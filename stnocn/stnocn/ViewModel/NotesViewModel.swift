//
//  NotesViewModel.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import Foundation
import CoreData
import SwiftUICore

class NotesViewModel: ObservableObject {
    let manager: CoreDataManager
    @Published var notes: [NoteEntity] = []
    @Published var isDataLoaded = false
    @Published var loadError: String? = nil
    
    private var debouncer = Debouncer()
    
    init(manager: CoreDataManager) {
        self.manager = manager
        loadData()
    }
    
    func loadData() {
        manager.loadCoreData { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self?.isDataLoaded = true
                    self?.fetchNotes()
                case .failure(let error):
                    self?.loadError = error.localizedDescription
                    self?.isDataLoaded = false
                }
            }
        }
    }

    func fetchNotes(with searchText: String = "") {
        let context = manager.backgroundContext
        context.perform {
            let request: NSFetchRequest<NoteEntity> = NoteEntity.fetchRequest()
            request.sortDescriptors = [NSSortDescriptor(key: "timestamp", ascending: false)]
            request.fetchBatchSize = 20

            if !searchText.isEmpty {
                request.predicate = NSPredicate(format: "title CONTAINS[cd] %@", searchText)
            }

            do {
                let notes = try context.fetch(request)
                DispatchQueue.main.async {
                    self.notes = notes
                }
            } catch {
                print("Error fetching notes: \(error)")
            }
        }
    }

    func createNote() -> NoteEntity {
        let newNote = NoteEntity(context: manager.viewContext)
        newNote.id = UUID()
        newNote.timestamp = Date()

        saveContext()
        notes.insert(newNote, at: 0) // Add the new note to the top of the list
        return newNote
    }

    func deleteNote(_ note: NoteEntity) {
        manager.viewContext.delete(note)
        saveContext()
        if let index = notes.firstIndex(of: note) {
            notes.remove(at: index) // Remove the note from the array
        }
    }

    func updateNote(_ note: NoteEntity, title: String, content: String) {
        note.title = title
        note.content = content
        saveContext()
    }
    
   

    func searchNotes(with searchText: String) {
        debouncer.debounce(delay: 0.5) {
            self.fetchNotes(with: searchText)
        }
    }


    private func saveContext() {
        let context = manager.backgroundContext
        context.perform {
            do {
                try context.save()
                DispatchQueue.main.async {
                    self.objectWillChange.send() // Notify SwiftUI to update
                }
            } catch {
                print("Error saving context: \(error)")
            }
        }
    }
}
