//
//  utils.swift
//  stnocn
//
//  Created by qwelian on 2/6/25.
//

import Dispatch

class Debouncer {
    private var workItem: DispatchWorkItem?

    func debounce(delay: Double, action: @escaping () -> Void) {
        workItem?.cancel()
        let task = DispatchWorkItem(block: action)
        workItem = task
        DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: task)
    }
}
