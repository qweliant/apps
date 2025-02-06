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
        let resign = #selector(UIResponder.resignFirstResponder)
        UIApplication.shared.sendAction(resign, to: nil, from: nil, for: nil)
    }
}
