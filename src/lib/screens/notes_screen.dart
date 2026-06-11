import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/storage_service.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _noteController = TextEditingController();
  final TextEditingController _missionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _noteController.dispose();
    _missionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final storage = context.read<StorageService>();

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
                    Icon(Icons.note, color: Color(0xFF6c63ff), size: 28),
                    SizedBox(width: 8),
                    Text(
                      'ملاحظات ومهام',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF16213e),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicator: BoxDecoration(
                      color: const Color(0xFF6c63ff).withOpacity(0.3),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    indicatorSize: TabBarIndicatorSize.tab,
                    dividerColor: Colors.transparent,
                    labelColor: Colors.white,
                    unselectedLabelColor: Colors.white38,
                    tabs: const [
                      Tab(text: 'ملاحظات'),
                      Tab(text: 'مهام'),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Tab views
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildNotesTab(storage),
                _buildMissionsTab(storage),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotesTab(StorageService storage) {
    final notes = storage.getNotes();

    return Column(
      children: [
        // Add note
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF16213e),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _noteController,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  maxLines: null,
                  textInputAction: TextInputAction.newline,
                  decoration: const InputDecoration(
                    hintText: 'اكتب ملاحظة...',
                    hintStyle: TextStyle(color: Colors.white38),
                    border: InputBorder.none,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add_circle, color: Color(0xFF6c63ff)),
                onPressed: () {
                  if (_noteController.text.trim().isNotEmpty) {
                    storage.addNote(_noteController.text.trim());
                    _noteController.clear();
                    setState(() {});
                  }
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),

        // Notes list
        Expanded(
          child: notes.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.note_add, color: Colors.white24, size: 48),
                      SizedBox(height: 12),
                      Text('مفيش ملاحظات لسه', style: TextStyle(color: Colors.white38)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: notes.length,
                  itemBuilder: (context, index) {
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF16213e),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              notes[index],
                              style: const TextStyle(color: Colors.white, fontSize: 14, height: 1.5),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Color(0xFFe94560), size: 20),
                            onPressed: () {
                              storage.deleteNote(index);
                              setState(() {});
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildMissionsTab(StorageService storage) {
    final missions = storage.getMissions();

    return Column(
      children: [
        // Add mission
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFF16213e),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white10),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _missionController,
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                  decoration: const InputDecoration(
                    hintText: 'أضف مهمة جديدة...',
                    hintStyle: TextStyle(color: Colors.white38),
                    border: InputBorder.none,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add_task, color: Color(0xFF6c63ff)),
                onPressed: () {
                  if (_missionController.text.trim().isNotEmpty) {
                    storage.addMission({
                      'text': _missionController.text.trim(),
                      'done': false,
                      'date': DateTime.now().toIso8601String(),
                    });
                    _missionController.clear();
                    setState(() {});
                  }
                },
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),

        // Missions list
        Expanded(
          child: missions.isEmpty
              ? const Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.task, color: Colors.white24, size: 48),
                      SizedBox(height: 12),
                      Text('مفيش مهام لسه', style: TextStyle(color: Colors.white38)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: missions.length,
                  itemBuilder: (context, index) {
                    final mission = missions[index];
                    final isDone = mission['done'] ?? false;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF16213e),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isDone
                              ? const Color(0xFF6c63ff).withOpacity(0.3)
                              : Colors.white10,
                        ),
                      ),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              storage.toggleMission(index);
                              setState(() {});
                            },
                            child: Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isDone
                                    ? const Color(0xFF6c63ff)
                                    : Colors.transparent,
                                border: Border.all(
                                  color: isDone
                                      ? const Color(0xFF6c63ff)
                                      : Colors.white38,
                                  width: 2,
                                ),
                              ),
                              child: isDone
                                  ? const Icon(Icons.check, color: Colors.white, size: 14)
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              mission['text'] ?? '',
                              style: TextStyle(
                                color: isDone ? Colors.white38 : Colors.white,
                                fontSize: 14,
                                decoration: isDone ? TextDecoration.lineThrough : null,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, color: Color(0xFFe94560), size: 20),
                            onPressed: () {
                              storage.deleteMission(index);
                              setState(() {});
                            },
                          ),
                        ],
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
