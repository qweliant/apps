//
//  Untitled.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI
import UniformTypeIdentifiers

struct EditNotesView: View {
    
    @EnvironmentObject var vm: NotesViewModel
    
    var note: NoteEntity
    
    @State private var title: String
    @State private var content: String
    @State private var debouncer = Debouncer()
    @State private var showDocumentPicker = false
    
    @FocusState private var contentEditorInFocus: Bool
    
    init(note: NoteEntity) {
        self.note = note
        _title = State(initialValue: note.title ?? "")
        _content = State(initialValue: note.content ?? "")
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            TextField("Whats in a Name", text: $title, axis: .vertical)
                .font(.title.bold())
                .foregroundColor(.pink)
                .submitLabel(.next)
                .onChange(of: title) { _, _ in
                    debounceSave()
                }
            Spacer()
            Button(
                action:{
                    showDocumentPicker.toggle()
                })
                {
                    Text("Somebody Saaaaaaaayyyyyve meeeeeeeee")
                        .font(.headline)
                        .foregroundColor(.accent)
                }
                .fileExporter(
                    isPresented: $showDocumentPicker,
                    document: TextFile(initialText: content),
                    contentType: .plainText,
                    defaultFilename: "note.md"
                ) { result in
                    switch result {
                    case .success(let url):
                        print("Saved to: \(url)")
                    case .failure(let error):
                        print("Error saving: \(error)")
                    }
                }
            
            Spacer()
            TextEditorView(text: $content)
                .onChange(of: content) { _, _ in
                    debounceSave()
                }
        }
        .padding(10)
        .background(Color.accent)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .keyboard) {
                   Spacer()
                   Button(action: {
                       hideKeyboard()
                       debounceSave()
                   }) {
                       Text("Donezo")
                           .font(.headline)
                           .foregroundColor(.accent)
                   }
               }
        }
        .onAppear {
            title = note.title ?? ""
            content = note.content ?? ""
        }
        .onChange(of: note) { oldNote, newNote in
            title = newNote.title ?? ""
            content = newNote.content ?? ""
        }
    }
    
    private func debounceSave() {
        debouncer.debounce(delay: 0.40) {
            saveChanges()
        }
    }
    
    private func saveChanges() {
        vm.updateNote(note, title: title, content: content)
    }
}

// MARK: - File Export Helper
struct TextFile: FileDocument {
    var text: String
    
    init(initialText: String) {
        self.text = initialText
    }
    
    static var readableContentTypes: [UTType] { [.plainText] }
    
    init(configuration: ReadConfiguration) throws {
        if let data = configuration.file.regularFileContents {
            self.text = String(decoding: data, as: UTF8.self)
        } else {
            throw CocoaError(.fileReadCorruptFile)
        }
    }
    
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        let data = text.data(using: .utf8) ?? Data()
        return FileWrapper(regularFileWithContents: data)
    }
}
