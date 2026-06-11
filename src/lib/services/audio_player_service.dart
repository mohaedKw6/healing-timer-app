import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:youtube_explode_dart/youtube_explode_dart.dart';

class AudioPlayerService extends ChangeNotifier {
  final AudioPlayer _player = AudioPlayer();
  final YoutubeExplode _yt = YoutubeExplode();

  bool _isPlaying = false;
  bool get isPlaying => _isPlaying;

  bool _isBuffering = false;
  bool get isBuffering => _isBuffering;

  String _currentTitle = '';
  String get currentTitle => _currentTitle;

  String _currentArtist = '';
  String get currentArtist => _currentArtist;

  String _currentThumbnail = '';
  String get currentThumbnail => _currentThumbnail;

  String _currentVideoId = '';
  String get currentVideoId => _currentVideoId;

  Duration _duration = Duration.zero;
  Duration get duration => _duration;

  Duration _position = Duration.zero;
  Duration get position => _position;

  double _volume = 0.5;
  double get volume => _volume;

  List<Map<String, dynamic>> _queue = [];
  List<Map<String, dynamic>> get queue => _queue;
  int _queueIndex = -1;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  List<Map<String, dynamic>> _searchResults = [];
  List<Map<String, dynamic>> get searchResults => _searchResults;

  bool _isSearching = false;
  bool get isSearching => _isSearching;

  AudioPlayerService() {
    _player.playbackEventStream.listen((event) {
      _isPlaying = _player.playing;
      _isBuffering = _player.processingState == ProcessingState.buffering;
      _duration = _player.duration ?? Duration.zero;
      _position = _player.position;
      notifyListeners();
    });

    _player.processingStateStream.listen((state) {
      if (state == ProcessingState.completed) {
        playNext();
      }
    });
  }

  void setVolume(double v) {
    _volume = v;
    _player.setVolume(v);
    notifyListeners();
  }

  Future<void> searchSongs(String query) async {
    _searchQuery = query;
    _isSearching = true;
    notifyListeners();

    try {
      final results = await _yt.search.search(query, filter: TypeFilters.video);
      _searchResults = results.where((v) => v.duration != null && v.duration!.inSeconds > 60).map((v) {
        return {
          'id': v.id.value,
          'title': v.title,
          'artist': v.author,
          'thumbnail': v.thumbnails.highResUrl,
          'duration': v.duration?.inSeconds ?? 0,
        };
      }).take(20).toList();
    } catch (e) {
      debugPrint('Search error: $e');
      _searchResults = [];
    }

    _isSearching = false;
    notifyListeners();
  }

  Future<void> playSong(String videoId, String title, String artist, String thumbnail) async {
    try {
      _currentVideoId = videoId;
      _currentTitle = title;
      _currentArtist = artist;
      _currentThumbnail = thumbnail;
      _isBuffering = true;
      notifyListeners();

      final manifest = await _yt.videos.streamsClient.getManifest(videoId);
      final audioStream = manifest.audioOnly.withHighestBitrate();
      final audioUrl = audioStream.url.toString();

      await _player.setUrl(audioUrl);
      await _player.setVolume(_volume);
      _player.play();
      _isPlaying = true;
      _isBuffering = false;
      notifyListeners();
    } catch (e) {
      debugPrint('Play error: $e');
      _isBuffering = false;
      _currentTitle = 'مش قادر أشغل الأغنية دي';
      notifyListeners();
    }
  }

  Future<void> playSongAndAddToQueue(Map<String, dynamic> song, {bool addToQueue = true}) async {
    if (addToQueue) {
      _queue.add(song);
      if (_queueIndex == -1) {
        _queueIndex = 0;
      }
    }

    await playSong(
      song['id'],
      song['title'],
      song['artist'],
      song['thumbnail'],
    );
  }

  void addToQueue(Map<String, dynamic> song) {
    _queue.add(song);
    notifyListeners();
  }

  Future<void> playNext() async {
    if (_queue.isEmpty) return;
    _queueIndex++;
    if (_queueIndex >= _queue.length) {
      _queueIndex = 0; // Loop back
    }
    final song = _queue[_queueIndex];
    await playSong(song['id'], song['title'], song['artist'], song['thumbnail']);
  }

  Future<void> playPrevious() async {
    if (_queue.isEmpty) return;
    _queueIndex--;
    if (_queueIndex < 0) {
      _queueIndex = _queue.length - 1;
    }
    final song = _queue[_queueIndex];
    await playSong(song['id'], song['title'], song['artist'], song['thumbnail']);
  }

  void togglePlayPause() {
    if (_player.playing) {
      _player.pause();
    } else {
      _player.play();
    }
    _isPlaying = !_isPlaying;
    notifyListeners();
  }

  Future<void> seekTo(Duration position) async {
    await _player.seek(position);
  }

  @override
  void dispose() {
    _player.dispose();
    _yt.close();
    super.dispose();
  }
}
