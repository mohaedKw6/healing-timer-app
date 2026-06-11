import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/audio_player_service.dart';

class MiniPlayer extends StatelessWidget {
  final VoidCallback onTap;

  const MiniPlayer({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioPlayerService>();

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF1a1a2e), Color(0xFF16213e)],
          ),
          border: Border(
            top: BorderSide(
              color: const Color(0xFF6c63ff).withOpacity(0.3),
            ),
          ),
        ),
        child: Row(
          children: [
            // Thumbnail
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Container(
                width: 40,
                height: 40,
                color: const Color(0xFF0a0a1a),
                child: audio.currentThumbnail.isNotEmpty
                    ? Image.network(
                        audio.currentThumbnail,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Icon(
                          Icons.music_note,
                          color: Color(0xFF6c63ff),
                          size: 20,
                        ),
                      )
                    : const Icon(
                        Icons.music_note,
                        color: Color(0xFF6c63ff),
                        size: 20,
                      ),
              ),
            ),
            const SizedBox(width: 12),

            // Song info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    audio.currentTitle,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    audio.currentArtist,
                    style: const TextStyle(color: Colors.white38, fontSize: 11),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            // Play/Pause button
            if (audio.isBuffering)
              const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  color: Color(0xFF6c63ff),
                  strokeWidth: 2,
                ),
              )
            else
              IconButton(
                icon: Icon(
                  audio.isPlaying ? Icons.pause : Icons.play_arrow,
                  color: Colors.white,
                ),
                onPressed: audio.togglePlayPause,
                iconSize: 24,
              ),
          ],
        ),
      ),
    );
  }
}
