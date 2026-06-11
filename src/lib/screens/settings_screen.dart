import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/audio_player_service.dart';
import '../services/storage_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioPlayerService>();
    final storage = context.read<StorageService>();

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            const Row(
              children: [
                Icon(Icons.settings, color: Color(0xFF6c63ff), size: 28),
                SizedBox(width: 8),
                Text(
                  'الإعدادات',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Music volume
            _buildSectionTitle('صوت الموسيقى'),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF16213e),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.volume_down, color: Colors.white38),
                  Expanded(
                    child: Slider(
                      value: audio.volume,
                      onChanged: (v) {
                        audio.setVolume(v);
                        storage.setVolume(v);
                      },
                      activeColor: const Color(0xFF6c63ff),
                      inactiveColor: Colors.white10,
                    ),
                  ),
                  const Icon(Icons.volume_up, color: Colors.white38),
                  const SizedBox(width: 8),
                  Text(
                    '${(audio.volume * 100).round()}%',
                    style: const TextStyle(color: Colors.white54, fontSize: 13),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // App info
            _buildSectionTitle('معلومات التطبيق'),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF16213e),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                children: [
                  _buildInfoRow('اسم التطبيق', 'Healing Timer'),
                  _buildInfoRow('الإصدار', '2.0.0'),
                  _buildInfoRow('النوع', 'تطبيق أصلي (Flutter)'),
                  _buildInfoRow('المنصة', 'Android Native'),
                  _buildInfoRow('مميزات', 'موسيقى + شات + تايمر'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Features
            _buildSectionTitle('المميزات'),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF16213e),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                children: [
                  _buildFeatureRow(Icons.timer, 'تايمر', 'عدّاد من 6 مايو 2026'),
                  _buildFeatureRow(Icons.music_note, 'موسيقى YouTube', 'بحث وتشغيل أغاني حقيقية'),
                  _buildFeatureRow(Icons.chat, 'شات AI', '3 أنماط: تشجيع/زعلان/تنبيهات'),
                  _buildFeatureRow(Icons.note, 'ملاحظات', 'كتابة وحفظ ملاحظات'),
                  _buildFeatureRow(Icons.task, 'مهام', 'قائمة مهام مع تتبع'),
                  _buildFeatureRow(Icons.settings, 'إعدادات', 'تحكم كامل'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Danger zone
            _buildSectionTitle('منطقة الخطر'),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF16213e),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFe94560).withOpacity(0.3)),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.delete_forever, color: Color(0xFFe94560)),
                    title: const Text('مسح كل الملاحظات', style: TextStyle(color: Colors.white70)),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          backgroundColor: const Color(0xFF16213e),
                          title: const Text('تأكيد', style: TextStyle(color: Colors.white)),
                          content: const Text(
                            'هل أنت متأكد إنك عايز تمسح كل الملاحظات؟',
                            style: TextStyle(color: Colors.white70),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('لا', style: TextStyle(color: Colors.white38)),
                            ),
                            TextButton(
                              onPressed: () {
                                storage.saveNotes([]);
                                setState(() {});
                                Navigator.pop(ctx);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('تم مسح كل الملاحظات'),
                                    backgroundColor: Color(0xFF16213e),
                                  ),
                                );
                              },
                              child: const Text('أه مسح', style: TextStyle(color: Color(0xFFe94560))),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.chat_bubble, color: Color(0xFFe94560)),
                    title: const Text('مسح كل المحادثات', style: TextStyle(color: Colors.white70)),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          backgroundColor: const Color(0xFF16213e),
                          title: const Text('تأكيد', style: TextStyle(color: Colors.white)),
                          content: const Text(
                            'هل أنت متأكد إنك عايز تمسح كل المحادثات؟',
                            style: TextStyle(color: Colors.white70),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('لا', style: TextStyle(color: Colors.white38)),
                            ),
                            TextButton(
                              onPressed: () {
                                storage.clearChatHistory('encouragement');
                                storage.clearChatHistory('sad');
                                storage.clearChatHistory('reminders');
                                Navigator.pop(ctx);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('تم مسح كل المحادثات'),
                                    backgroundColor: Color(0xFF16213e),
                                  ),
                                );
                              },
                              child: const Text('أه مسح', style: TextStyle(color: Color(0xFFe94560))),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Footer
            const Center(
              child: Column(
                children: [
                  Icon(Icons.favorite, color: Color(0xFFe94560), size: 20),
                  SizedBox(height: 8),
                  Text(
                    'Healing Timer v2.0',
                    style: TextStyle(color: Colors.white24, fontSize: 12),
                  ),
                  Text(
                    'تطبيق أصلي 100% - مش ويب فيو',
                    style: TextStyle(color: Color(0x1AFFFFFF), fontSize: 11),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white54,
          fontSize: 13,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 13)),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildFeatureRow(IconData icon, String title, String subtitle) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: const Color(0xFF6c63ff), size: 22),
      title: Text(title, style: const TextStyle(color: Colors.white, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(color: Colors.white38, fontSize: 11)),
    );
  }
}
