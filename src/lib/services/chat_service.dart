import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ChatService extends ChangeNotifier {
  String _currentMode = 'encouragement';
  String get currentMode => _currentMode;

  List<Map<String, dynamic>> _messages = [];
  List<Map<String, dynamic>> get messages => _messages;

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  static const String _apiToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWQ2ZTgzN2UtZWZkMS00NzFjLWJiOTgtZDIzY2I5NTQxM2NkIiwiY2hhdF9pZCI6ImNoYXQtNTI5OTYzZWEtMjdkZC00MjQ2LTk3ZDAtNTA0MTc5YzJlODc5IiwicGxhdGZvcm0iOiJ6YWkifQ.XxsFeMFyTPnKTzEM9YULItNGpvprF_HIJqtLQbqr8Eg';

  static const Map<String, String> _systemPrompts = {
    'encouragement': 'انت صديق داعم ومشجع. تتكلم بالعربي المصري. دورك انك تشجع المستخدم وتديله طاقة ايجابية وتخليه يحس بالأمل. استخدم كلام دافئ ومحفز. خليك صديق مقرب مش معلم.',
    'sad': 'انت صديق زعلان شعرك. تتكلم بالعربي المصري. انت فاهم الزعل والوحدة. اسمع المستخدم وشاركه مشاعره. متحاولش تحل المشكلة بس كن معاه. قول حاجات من القلب.',
    'reminders': 'انت مساعد ذكي. تتكلم بالعربي المصري. دورك تذكر المستخدم بحاجات مهمة في حياته. سواء اهداف او مواعيد او حاجات لازم يعملها. كن لطيف ومباشر.',
  };

  static const Map<String, String> _modeNames = {
    'encouragement': 'تشجيع',
    'sad': 'زعلان',
    'reminders': 'انهاء الوقت',
  };

  static const Map<String, IconData> _modeIcons = {
    'encouragement': Icons.favorite,
    'sad': Icons.cloud,
    'reminders': Icons.alarm,
  };

  static const Map<String, Color> _modeColors = {
    'encouragement': Color(0xFF6c63ff),
    'sad': Color(0xFF5c6bc0),
    'reminders': Color(0xFFe94560),
  };

  Map<String, String> get modeNames => _modeNames;
  Map<String, IconData> get modeIcons => _modeIcons;
  Map<String, Color> get modeColors => _modeColors;

  void setMode(String mode) {
    _currentMode = mode;
    _messages = [];
    notifyListeners();
  }

  void loadMessages(List<Map<String, dynamic>> saved) {
    _messages = saved;
    notifyListeners();
  }

  Future<String> sendMessage(String userMessage) async {
    _messages.add({'role': 'user', 'content': userMessage});
    _isLoading = true;
    notifyListeners();

    try {
      final systemPrompt = _systemPrompts[_currentMode] ?? _systemPrompts['encouragement']!;

      final chatMessages = [
        {'role': 'system', 'content': systemPrompt},
        ..._messages.map((m) => {'role': m['role'], 'content': m['content']}).toList(),
      ];

      final response = await http.post(
        Uri.parse('https://internal-api.z.ai/v1/chat/completions'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_apiToken',
        },
        body: jsonEncode({
          'messages': chatMessages,
          'model': 'glm-4-flash',
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final reply = data['choices']?[0]?['message']?['content'] ?? 'معرفش اقولك ايه دلوقتي...';
        _messages.add({'role': 'assistant', 'content': reply});
        _isLoading = false;
        notifyListeners();
        return reply;
      } else {
        final errorMsg = 'حصلت مشكلة في الاتصال... جرب تاني';
        _messages.add({'role': 'assistant', 'content': errorMsg});
        _isLoading = false;
        notifyListeners();
        return errorMsg;
      }
    } catch (e) {
      final errorMsg = 'مش قادر أوصل بالسيرفر... اتصل بالنت وجرب تاني';
      _messages.add({'role': 'assistant', 'content': errorMsg});
      _isLoading = false;
      notifyListeners();
      return errorMsg;
    }
  }

  void clearMessages() {
    _messages = [];
    notifyListeners();
  }
}
