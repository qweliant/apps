//
//  Extensions.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import Foundation
import SwiftUI

// MARK: View

extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}
