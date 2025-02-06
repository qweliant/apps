//
//  CoreDataManager.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import CoreData

class CoreDataManager {
    
    static let shared = CoreDataManager()
    
    let container: NSPersistentContainer

    private init() {
        container = NSPersistentContainer(name: "NotesContainer")
    }

    func loadCoreData(completion: @escaping (Result<Bool, CoreDataError>) -> Void) {
           container.loadPersistentStores { description, error in
               DispatchQueue.main.async {
                   if let error = error {
                       completion(.failure(.loadFailed(error.localizedDescription)))
                   } else {
                       completion(.success(true))
                   }
               }
           }
       }

   var viewContext: NSManagedObjectContext {
       return container.viewContext
   }

   lazy var backgroundContext: NSManagedObjectContext = {
       let context = container.newBackgroundContext()
       context.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
       return context
   }()
}

enum CoreDataError: Error {
   case loadFailed(String)
   case saveFailed(String)
}
