import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  final SharedPreferences _prefs;

  StorageService(this._prefs);

  // Notes
  List<String> getNotes() {
    return _prefs.getStringList('notes') ?? [];
  }

  void saveNotes(List<String> notes) {
    _prefs.setStringList('notes', notes);
  }

  void addNote(String note) {
    final notes = getNotes();
    notes.insert(0, note);
    saveNotes(notes);
  }

  void deleteNote(int index) {
    final notes = getNotes();
    if (index >= 0 && index < notes.length) {
      notes.removeAt(index);
      saveNotes(notes);
    }
  }

  // Missions
  List<Map<String, dynamic>> getMissions() {
    final data = _prefs.getStringList('missions') ?? [];
    return data.map((e) => jsonDecode(e) as Map<String, dynamic>).toList();
  }

  void saveMissions(List<Map<String, dynamic>> missions) {
    final data = missions.map((e) => jsonEncode(e)).toList();
    _prefs.setStringList('missions', data);
  }

  void addMission(Map<String, dynamic> mission) {
    final missions = getMissions();
    missions.add(mission);
    saveMissions(missions);
  }

  void toggleMission(int index) {
    final missions = getMissions();
    if (index >= 0 && index < missions.length) {
      missions[index]['done'] = !(missions[index]['done'] ?? false);
      saveMissions(missions);
    }
  }

  void deleteMission(int index) {
    final missions = getMissions();
    if (index >= 0 && index < missions.length) {
      missions.removeAt(index);
      saveMissions(missions);
    }
  }

  // Chat history
  List<Map<String, dynamic>> getChatHistory(String mode) {
    final data = _prefs.getStringList('chat_$mode') ?? [];
    return data.map((e) => jsonDecode(e) as Map<String, dynamic>).toList();
  }

  void saveChatHistory(String mode, List<Map<String, dynamic>> messages) {
    final data = messages.map((e) => jsonEncode(e)).toList();
    _prefs.setStringList('chat_$mode', data);
  }

  void addChatMessage(String mode, Map<String, dynamic> message) {
    final history = getChatHistory(mode);
    history.add(message);
    saveChatHistory(mode, history);
  }

  void clearChatHistory(String mode) {
    _prefs.remove('chat_$mode');
  }

  // Volume
  double getVolume() {
    return _prefs.getDouble('volume') ?? 0.5;
  }

  void setVolume(double vol) {
    _prefs.setDouble('volume', vol);
  }

  // Theme
  int getThemeIndex() {
    return _prefs.getInt('theme_index') ?? 0;
  }

  void setThemeIndex(int index) {
    _prefs.setInt('theme_index', index);
  }

  // Music favorites
  List<String> getFavoriteSongs() {
    return _prefs.getStringList('fav_songs') ?? [];
  }

  void toggleFavoriteSong(String videoId) {
    final favs = getFavoriteSongs();
    if (favs.contains(videoId)) {
      favs.remove(videoId);
    } else {
      favs.add(videoId);
    }
    _prefs.setStringList('fav_songs', favs);
  }

  // Playback history
  List<String> getPlaybackHistory() {
    return _prefs.getStringList('playback_history') ?? [];
  }

  void addToPlaybackHistory(String videoId) {
    final history = getPlaybackHistory();
    history.remove(videoId);
    history.insert(0, videoId);
    if (history.length > 50) history.removeLast();
    _prefs.setStringList('playback_history', history);
  }
}
