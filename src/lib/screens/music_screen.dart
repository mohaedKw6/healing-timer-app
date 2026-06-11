import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/audio_player_service.dart';

class MusicScreen extends StatefulWidget {
  const MusicScreen({super.key});

  @override
  State<MusicScreen> createState() => _MusicScreenState();
}

class _MusicScreenState extends State<MusicScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioPlayerService>();

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                const Row(
                  children: [
                    Icon(Icons.music_note, color: Color(0xFF6c63ff), size: 28),
                    SizedBox(width: 8),
                    Text(
                      'موسيقى YouTube',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Search bar
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF16213e),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _searchController,
                          style: const TextStyle(color: Colors.white),
                          textInputAction: TextInputAction.search,
                          onSubmitted: (value) {
                            if (value.trim().isNotEmpty) {
                              audio.searchSongs(value.trim());
                            }
                          },
                          decoration: const InputDecoration(
                            hintText: 'ابحث عن أغنية...',
                            hintStyle: TextStyle(color: Colors.white38),
                            prefixIcon: Icon(Icons.search, color: Colors.white38),
                            border: InputBorder.none,
                            contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.all(6),
                        child: Material(
                          color: const Color(0xFF6c63ff),
                          borderRadius: BorderRadius.circular(12),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(12),
                            onTap: () {
                              if (_searchController.text.trim().isNotEmpty) {
                                audio.searchSongs(_searchController.text.trim());
                              }
                            },
                            child: const Padding(
                              padding: EdgeInsets.all(10),
                              child: Icon(Icons.search, color: Colors.white),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Now playing card
          if (audio.currentTitle.isNotEmpty)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1a1a2e), Color(0xFF16213e)],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: const Color(0xFF6c63ff).withOpacity(0.4),
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6c63ff).withOpacity(0.15),
                    blurRadius: 20,
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      // Thumbnail
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          width: 56,
                          height: 56,
                          color: const Color(0xFF0a0a1a),
                          child: audio.currentThumbnail.isNotEmpty
                              ? Image.network(
                                  audio.currentThumbnail,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => const Icon(
                                    Icons.music_note,
                                    color: Color(0xFF6c63ff),
                                    size: 28,
                                  ),
                                )
                              : const Icon(
                                  Icons.music_note,
                                  color: Color(0xFF6c63ff),
                                  size: 28,
                                ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              audio.currentTitle,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              audio.currentArtist,
                              style: const TextStyle(
                                color: Colors.white54,
                                fontSize: 12,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      if (audio.isBuffering)
                        const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            color: Color(0xFF6c63ff),
                            strokeWidth: 2,
                          ),
                        ),
                    ],
                  ),

                  // Progress bar
                  const SizedBox(height: 12),
                  StreamBuilder<Duration?>(
                    stream: null,
                    builder: (context, _) {
                      return Column(
                        children: [
                          SliderTheme(
                            data: SliderThemeData(
                              thumbColor: const Color(0xFF6c63ff),
                              activeTrackColor: const Color(0xFF6c63ff),
                              inactiveTrackColor: Colors.white10,
                              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                              trackHeight: 3,
                            ),
                            child: Slider(
                              value: audio.duration.inMilliseconds > 0
                                  ? (audio.position.inMilliseconds / audio.duration.inMilliseconds).clamp(0.0, 1.0)
                                  : 0.0,
                              onChanged: (value) {
                                final pos = Duration(
                                  milliseconds: (audio.duration.inMilliseconds * value).round(),
                                );
                                audio.seekTo(pos);
                              },
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                _formatDuration(audio.position),
                                style: const TextStyle(color: Colors.white38, fontSize: 11),
                              ),
                              Text(
                                _formatDuration(audio.duration),
                                style: const TextStyle(color: Colors.white38, fontSize: 11),
                              ),
                            ],
                          ),
                        ],
                      );
                    },
                  ),

                  // Controls
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.skip_previous, color: Colors.white70),
                        onPressed: audio.playPrevious,
                      ),
                      const SizedBox(width: 8),
                      Container(
                        decoration: const BoxDecoration(
                          color: Color(0xFF6c63ff),
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          iconSize: 32,
                          icon: Icon(
                            audio.isPlaying ? Icons.pause : Icons.play_arrow,
                            color: Colors.white,
                          ),
                          onPressed: audio.togglePlayPause,
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.skip_next, color: Colors.white70),
                        onPressed: audio.playNext,
                      ),
                      const SizedBox(width: 8),
                      SizedBox(
                        width: 100,
                        child: Row(
                          children: [
                            const Icon(Icons.volume_up, color: Colors.white38, size: 18),
                            Expanded(
                              child: Slider(
                                value: audio.volume,
                                onChanged: audio.setVolume,
                                activeColor: const Color(0xFF6c63ff),
                                inactiveColor: Colors.white10,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

          // Search results
          Expanded(
            child: audio.isSearching
                ? const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircularProgressIndicator(color: Color(0xFF6c63ff)),
                        SizedBox(height: 16),
                        Text(
                          'بدور على الأغاني...',
                          style: TextStyle(color: Colors.white54),
                        ),
                      ],
                    ),
                  )
                : audio.searchResults.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.search, color: Colors.white24, size: 64),
                            const SizedBox(height: 16),
                            const Text(
                              'ابحث عن أغنية عشان تشغلها',
                              style: TextStyle(color: Colors.white38, fontSize: 16),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'اكتب اسم الأغنية أو المغني',
                              style: TextStyle(color: Colors.white24, fontSize: 13),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: audio.searchResults.length,
                        itemBuilder: (context, index) {
                          final song = audio.searchResults[index];
                          final isCurrentSong = song['id'] == audio.currentVideoId;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            decoration: BoxDecoration(
                              color: isCurrentSong
                                  ? const Color(0xFF6c63ff).withOpacity(0.15)
                                  : const Color(0xFF16213e),
                              borderRadius: BorderRadius.circular(14),
                              border: isCurrentSong
                                  ? Border.all(color: const Color(0xFF6c63ff).withOpacity(0.5))
                                  : null,
                            ),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              leading: ClipRRect(
                                borderRadius: BorderRadius.circular(10),
                                child: Container(
                                  width: 50,
                                  height: 50,
                                  color: const Color(0xFF0a0a1a),
                                  child: song['thumbnail'] != null
                                      ? Image.network(
                                          song['thumbnail'],
                                          fit: BoxFit.cover,
                                          errorBuilder: (_, __, ___) => const Icon(
                                            Icons.music_note,
                                            color: Color(0xFF6c63ff),
                                          ),
                                        )
                                      : const Icon(
                                          Icons.music_note,
                                          color: Color(0xFF6c63ff),
                                        ),
                                ),
                              ),
                              title: Text(
                                song['title'] ?? '',
                                style: TextStyle(
                                  color: isCurrentSong ? const Color(0xFF6c63ff) : Colors.white,
                                  fontSize: 13,
                                  fontWeight: isCurrentSong ? FontWeight.w600 : FontWeight.normal,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              subtitle: Text(
                                song['artist'] ?? '',
                                style: const TextStyle(color: Colors.white38, fontSize: 11),
                                maxLines: 1,
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (song['duration'] != null)
                                    Text(
                                      _formatDuration(Duration(seconds: song['duration'])),
                                      style: const TextStyle(color: Colors.white24, fontSize: 11),
                                    ),
                                  IconButton(
                                    icon: const Icon(Icons.playlist_add, color: Colors.white38, size: 20),
                                    onPressed: () {
                                      audio.addToQueue(song);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('اتضافت ${song['title']} للقائمة'),
                                          backgroundColor: const Color(0xFF16213e),
                                          duration: const Duration(seconds: 1),
                                        ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                              onTap: () {
                                audio.playSongAndAddToQueue(song);
                              },
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes;
    final seconds = d.inSeconds % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }
}
