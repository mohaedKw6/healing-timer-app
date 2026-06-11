import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/audio_player_service.dart';
import '../screens/timer_screen.dart';
import '../screens/music_screen.dart';
import '../screens/chat_screen.dart';
import '../screens/notes_screen.dart';
import '../screens/settings_screen.dart';
import '../widgets/mini_player.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const TimerScreen(),
    const MusicScreen(),
    const ChatScreen(),
    const NotesScreen(),
    const SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final audioService = context.watch<AudioPlayerService>();

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0a0a1a),
              Color(0xFF1a1a2e),
              Color(0xFF16213e),
              Color(0xFF0a0a1a),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                child: _screens[_currentIndex],
              ),
              if (audioService.currentTitle.isNotEmpty)
                MiniPlayer(
                  onTap: () {
                    setState(() {
                      _currentIndex = 1;
                    });
                  },
                ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF0f0f23),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: NavigationBar(
          backgroundColor: Colors.transparent,
          indicatorColor: const Color(0xFF6c63ff).withOpacity(0.3),
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.timer_outlined, color: Colors.white54),
              selectedIcon: Icon(Icons.timer, color: Color(0xFF6c63ff)),
              label: 'التايمر',
            ),
            NavigationDestination(
              icon: Icon(Icons.music_note_outlined, color: Colors.white54),
              selectedIcon: Icon(Icons.music_note, color: Color(0xFF6c63ff)),
              label: 'موسيقى',
            ),
            NavigationDestination(
              icon: Icon(Icons.chat_outlined, color: Colors.white54),
              selectedIcon: Icon(Icons.chat, color: Color(0xFF6c63ff)),
              label: 'شات',
            ),
            NavigationDestination(
              icon: Icon(Icons.note_outlined, color: Colors.white54),
              selectedIcon: Icon(Icons.note, color: Color(0xFF6c63ff)),
              label: 'ملاحظات',
            ),
            NavigationDestination(
              icon: Icon(Icons.settings_outlined, color: Colors.white54),
              selectedIcon: Icon(Icons.settings, color: Color(0xFF6c63ff)),
              label: 'إعدادات',
            ),
          ],
        ),
      ),
    );
  }
}
