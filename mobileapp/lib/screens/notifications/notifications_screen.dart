import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<Map<String, dynamic>> _notifications = [
    {
      'id': 1,
      'title': 'Meeting Reminder',
      'message': 'Your meeting with John Doe is in 30 minutes',
      'type': 'reminder',
      'icon': Icons.notifications_active,
      'color': AppColors.warning,
      'time': '10 minutes ago',
      'read': false,
    },
    {
      'id': 2,
      'title': 'Check-in Confirmed',
      'message': 'Your check-in at 09:30 AM has been confirmed',
      'type': 'success',
      'icon': Icons.check_circle,
      'color': AppColors.success,
      'time': '1 hour ago',
      'read': true,
    },
    {
      'id': 3,
      'title': 'New Report Available',
      'message': 'Your monthly attendance report is ready',
      'type': 'info',
      'icon': Icons.assessment,
      'color': AppColors.info,
      'time': '2 hours ago',
      'read': true,
    },
    {
      'id': 4,
      'title': 'System Update',
      'message': 'App will be updated tomorrow at 2 AM',
      'type': 'info',
      'icon': Icons.system_update,
      'color': AppColors.info,
      'time': '5 hours ago',
      'read': true,
    },
  ];

  late List<Map<String, dynamic>> _displayedNotifications;

  @override
  void initState() {
    super.initState();
    _displayedNotifications = List.from(_notifications);
  }

  void _markAsRead(int id) {
    setState(() {
      final index = _displayedNotifications.indexWhere((n) => n['id'] == id);
      if (index != -1) {
        _displayedNotifications[index]['read'] = true;
      }
    });
  }

  void _deleteNotification(int id) {
    setState(() {
      _displayedNotifications.removeWhere((n) => n['id'] == id);
    });
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Notification deleted')));
  }

  void _markAllAsRead() {
    setState(() {
      for (var notification in _displayedNotifications) {
        notification['read'] = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppStrings.notifications,
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        backgroundColor: AppColors.background,
        actions: [
          if (_displayedNotifications.any((n) => !n['read']))
            TextButton(
              onPressed: _markAllAsRead,
              child: Text(
                'Mark All',
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
            ),
        ],
      ),
      body: _displayedNotifications.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.notifications_off_outlined,
                    size: 80,
                    color: AppColors.greyLight,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    AppStrings.noNotifications,
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.grey,
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _displayedNotifications.length,
              itemBuilder: (context, index) {
                final notification = _displayedNotifications[index];
                return Dismissible(
                  key: Key(notification['id'].toString()),
                  onDismissed: (direction) {
                    _deleteNotification(notification['id']);
                  },
                  background: Container(
                    decoration: BoxDecoration(
                      color: AppColors.error,
                      borderRadius: BorderRadius.circular(
                        AppConstants.borderRadius,
                      ),
                    ),
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 20),
                    child: const Icon(Icons.delete, color: AppColors.white),
                  ),
                  child: Card(
                    elevation: 1,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        AppConstants.borderRadius,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        color: notification['read']
                            ? AppColors.white
                            : AppColors.primary.withOpacity(0.05),
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                        border: Border.all(
                          color: notification['read']
                              ? Colors.transparent
                              : AppColors.primary.withOpacity(0.2),
                        ),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(16),
                        leading: Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: notification['color'].withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            notification['icon'],
                            color: notification['color'],
                          ),
                        ),
                        title: Text(
                          notification['title'],
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.black,
                          ),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 4),
                            Text(
                              notification['message'],
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                color: AppColors.grey,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 6),
                            Text(
                              notification['time'],
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                color: AppColors.grey.withOpacity(0.7),
                              ),
                            ),
                          ],
                        ),
                        trailing: !notification['read']
                            ? Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppColors.primary,
                                  shape: BoxShape.circle,
                                ),
                              )
                            : null,
                        onTap: () {
                          if (!notification['read']) {
                            _markAsRead(notification['id']);
                          }
                        },
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
