import Foundation

enum ExpenseType: String, Codable, CaseIterable {
    case business
    case personal

    var displayName: String {
        switch self {
        case .business: return "商务"
        case .personal: return "个人"
        }
    }
}

enum LocationShareMode: String, Codable, CaseIterable {
    case none
    case approx
    case precise

    var displayName: String {
        switch self {
        case .none: return "不包含位置"
        case .approx: return "仅大概位置"
        case .precise: return "精确位置"
        }
    }
}

struct EmergencyContact: Identifiable, Codable, Equatable {
    var id: UUID = UUID()
    var name: String
    var relation: String?
    var email: String
    var enabled: Bool = true
}

struct CheckInRecord: Identifiable, Codable, Equatable {
    var id: UUID = UUID()
    var timestamp: Date
    var shareMode: LocationShareMode
    var lat: Double?
    var lng: Double?
    var accuracyMeters: Double?
}

struct SafetySettings: Codable, Equatable {
    var alertsEnabled: Bool = true
    var includeLocationInAlert: LocationShareMode = .approx
    let thresholdHours: Int = 72
}

// Note: v1 iOS app is scaffold-only. Core Data models will be added once we finalize entities.
