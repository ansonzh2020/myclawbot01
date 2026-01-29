import SwiftUI

struct SettingsView: View {
    @State private var alertsEnabled = true
    @State private var includeLocationInAlert: LocationShareMode = .approx

    var body: some View {
        NavigationStack {
            Form {
                Section("安全告警") {
                    Toggle("启用告警", isOn: $alertsEnabled)
                    Picker("邮件包含位置", selection: $includeLocationInAlert) {
                        ForEach(LocationShareMode.allCases, id: \.self) { mode in
                            Text(mode.displayName).tag(mode)
                        }
                    }
                    Text("规则：超过 72 小时未签到将触发邮件告警（每 24 小时最多一次，直到你再次签到）。")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section("紧急联系人") {
                    ContentUnavailableView("紧急联系人", systemImage: "person.2", description: Text("v1.0 将支持多个联系人，并可测试发送告警邮件。"))
                }

                Section("隐私") {
                    Text("v1.0：旅行花费数据只保存在本地设备。后端仅保存告警所需信息（最后签到时间、联系人邮箱、告警设置）。")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("设置")
        }
    }
}

#Preview {
    SettingsView()
}
