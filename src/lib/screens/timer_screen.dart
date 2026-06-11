import 'dart:async';
import 'package:flutter/material.dart';

class TimerScreen extends StatefulWidget {
  const TimerScreen({super.key});

  @override
  State<TimerScreen> createState() => _TimerScreenState();
}

class _TimerScreenState extends State<TimerScreen> with TickerProviderStateMixin {
  static final DateTime _startDate = DateTime(2026, 5, 6, 3, 53, 0);
  late Timer _timer;
  Duration _elapsed = Duration.zero;
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _updateElapsed();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateElapsed();
    });
  }

  void _updateElapsed() {
    if (!mounted) return;
    final now = DateTime.now();
    setState(() {
      _elapsed = now.difference(_startDate);
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  String _formatDuration(Duration d) {
    final days = d.inDays;
    final hours = d.inHours % 24;
    final minutes = d.inMinutes % 60;
    final seconds = d.inSeconds % 60;
    return '${days.toString().padLeft(2, '0')}:${hours.toString().padLeft(2, '0')}:${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final days = _elapsed.inDays;
    final hours = _elapsed.inHours % 24;
    final minutes = _elapsed.inMinutes % 60;
    final seconds = _elapsed.inSeconds % 60;
    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          // Rain effect background
          CustomPaint(
            size: screenSize,
            painter: RainPainter(_pulseController),
          ),

          // Main content
          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Heart icon with pulse
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: 1.0 + _pulseController.value * 0.08,
                        child: child,
                      );
                    },
                    child: const Icon(
                      Icons.favorite,
                      color: Color(0xFFe94560),
                      size: 64,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Title
                  const Text(
                    'الوقت اللي فات',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 18,
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'من 6 مايو 2026 - 3:53 الفجر',
                    style: TextStyle(
                      color: Colors.white38,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Main timer display
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFF16213e),
                          Color(0xFF1a1a2e),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: const Color(0xFF6c63ff).withOpacity(0.3),
                        width: 1,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6c63ff).withOpacity(0.1),
                          blurRadius: 30,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _buildTimeUnit(days, 'يوم'),
                            const SizedBox(width: 12),
                            _buildTimeUnit(hours, 'ساعة'),
                            const SizedBox(width: 12),
                            _buildTimeUnit(minutes, 'دقيقة'),
                            const SizedBox(width: 12),
                            _buildTimeUnit(seconds, 'ثانية'),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _formatDuration(_elapsed),
                          style: const TextStyle(
                            color: Color(0xFF6c63ff),
                            fontSize: 14,
                            fontFamily: 'monospace',
                            letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Stats cards
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          'إجمالي الساعات',
                          '${_elapsed.inHours}',
                          Icons.access_time,
                          const Color(0xFF6c63ff),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'إجمالي الدقائق',
                          '${_elapsed.inMinutes}',
                          Icons.timer,
                          const Color(0xFFe94560),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          'عدد الأسابيع',
                          '${(_elapsed.inDays / 7).floor()}',
                          Icons.calendar_today,
                          const Color(0xFF00b4d8),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'عدد الأيام',
                          '${_elapsed.inDays}',
                          Icons.today,
                          const Color(0xFFf4a261),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // Quote card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF16213e).withOpacity(0.5),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: Colors.white10,
                      ),
                    ),
                    child: const Column(
                      children: [
                        Icon(Icons.format_quote, color: Color(0xFF6c63ff), size: 28),
                        SizedBox(height: 8),
                        Text(
                          'كل ثانية بتعدي بتقربك من يوم أحسن... سلامتك قلبك',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 15,
                            height: 1.6,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeUnit(int value, String label) {
    return Column(
      children: [
        AnimatedBuilder(
          animation: _pulseController,
          builder: (context, child) {
            return Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF0a0a1a),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: const Color(0xFF6c63ff).withOpacity(0.5),
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6c63ff).withOpacity(
                      0.1 + _pulseController.value * 0.1,
                    ),
                    blurRadius: 15,
                  ),
                ],
              ),
              child: Text(
                value.toString().padLeft(2, '0'),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  fontFamily: 'monospace',
                ),
              ),
            );
          },
        ),
        const SizedBox(height: 6),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white38,
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF16213e),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white54,
              fontSize: 11,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class RainPainter extends CustomPainter {
  final Animation<double> animation;

  RainPainter(this.animation) : super(repaint: animation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.lightBlueAccent.withOpacity(0.12)
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round;

    for (int i = 0; i < 40; i++) {
      final x = (i * 37.0 + 10) % size.width;
      final speed = 0.3 + (i % 5) * 0.1;
      final y = ((animation.value * speed + i * 0.025) % 1.0) * size.height;
      final length = 12.0 + (i % 3) * 5.0;

      canvas.drawLine(
        Offset(x, y),
        Offset(x + 1, y + length),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
