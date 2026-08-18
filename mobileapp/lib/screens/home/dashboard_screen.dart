import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:badges/badges.dart' as badges;
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;
  bool _isCheckedIn = false;
  int _notificationCount = 3;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildGreetingSection(),
            _buildTodaysSummaryCard(),
            _buildQuickActionsSection(),
            _buildRecentActivitySection(),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      title: Text(
        AppStrings.dashboard,
        style: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: AppColors.black,
        ),
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Center(
            child: badges.Badge(
              badgeContent: Text(
                _notificationCount.toString(),
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.white,
                ),
              ),
              badgeStyle: const badges.BadgeStyle(badgeColor: AppColors.error),
              child: IconButton(
                icon: const Icon(Icons.notifications_none),
                onPressed: () {
                  Navigator.of(context).pushNamed('/notifications');
                },
              ),
            ),
          ),
        ),
      ],
      elevation: 0,
      backgroundColor: AppColors.background,
    );
  }

  Widget _buildGreetingSection() {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${AppStrings.welcome} back!',
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.black,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Wednesday, August 13, 2025',
            style: GoogleFonts.poppins(fontSize: 13, color: AppColors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildTodaysSummaryCard() {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.largeBorderRadius),
        ),
        child: Container(
          decoration: BoxDecoration(
            gradient: AppColors.purpleGradient,
            borderRadius: BorderRadius.circular(AppConstants.largeBorderRadius),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "${AppStrings.todaysSummary}",
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.white,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      _isCheckedIn ? 'Checked In' : 'Not Started',
                      style: GoogleFonts.poppins(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.white,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildSummaryItem(
                    label: AppStrings.checkInTime,
                    value: _isCheckedIn ? '09:30 AM' : '—',
                  ),
                  _buildSummaryItem(
                    label: AppStrings.checkOutTime,
                    value: _isCheckedIn ? '—' : '—',
                  ),
                  _buildSummaryItem(
                    label: AppStrings.workingHours,
                    value: _isCheckedIn ? '0h 15m' : '0h 0m',
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryItem({required String label, required String value}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 11,
            color: AppColors.white.withOpacity(0.7),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionsSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Quick Actions',
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.black,
            ),
          ),
          const SizedBox(height: 16),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            childAspectRatio: 1.2,
            children: [
              _buildQuickActionCard(
                icon: Icons.login_outlined,
                label: AppStrings.checkInOut,
                color: AppColors.secondary,
                onTap: () {
                  Navigator.of(context).pushNamed('/check-in');
                },
              ),
              _buildQuickActionCard(
                icon: Icons.location_on_outlined,
                label: AppStrings.clientVisit,
                color: AppColors.warning,
                onTap: () {
                  Navigator.of(context).pushNamed('/client-visit');
                },
              ),
              _buildQuickActionCard(
                icon: Icons.analytics_outlined,
                label: AppStrings.reports,
                color: AppColors.success,
                onTap: () {
                  Navigator.of(context).pushNamed('/reports');
                },
              ),
              _buildQuickActionCard(
                icon: Icons.person_outline,
                label: AppStrings.profile,
                color: AppColors.primary,
                onTap: () {
                  Navigator.of(context).pushNamed('/profile');
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionCard({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.borderRadius),
        ),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppConstants.borderRadius),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 28),
              ),
              const SizedBox(height: 12),
              Text(
                label,
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppColors.black,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentActivitySection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Recent Activity',
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.black,
            ),
          ),
          const SizedBox(height: 16),
          _buildActivityItem(
            icon: Icons.login,
            title: 'Checked In',
            subtitle: 'Today at 09:30 AM',
            time: '2 hours ago',
            color: AppColors.success,
          ),
          const SizedBox(height: 12),
          _buildActivityItem(
            icon: Icons.location_on,
            title: 'Client Visit - ABC Corp',
            subtitle: 'New York Office',
            time: '1 hour ago',
            color: AppColors.info,
          ),
          const SizedBox(height: 12),
          _buildActivityItem(
            icon: Icons.notifications,
            title: 'New Notification',
            subtitle: 'Meeting scheduled for tomorrow',
            time: '30 minutes ago',
            color: AppColors.warning,
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required String time,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          width: 45,
          height: 45,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.black,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: GoogleFonts.poppins(fontSize: 12, color: AppColors.grey),
              ),
            ],
          ),
        ),
        Text(
          time,
          style: GoogleFonts.poppins(fontSize: 11, color: AppColors.grey),
        ),
      ],
    );
  }

  BottomNavigationBar _buildBottomNavigationBar() {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      backgroundColor: AppColors.white,
      currentIndex: _selectedIndex,
      elevation: 8,
      selectedItemColor: AppColors.primary,
      unselectedItemColor: AppColors.grey,
      onTap: (index) {
        setState(() => _selectedIndex = index);
        _navigateToPage(index);
      },
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.location_on_outlined),
          activeIcon: Icon(Icons.location_on),
          label: 'Visits',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications_none),
          activeIcon: Icon(Icons.notifications),
          label: 'Notifications',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          activeIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
    );
  }

  void _navigateToPage(int index) {
    switch (index) {
      case 0:
        // Stay on home
        break;
      case 1:
        Navigator.of(context).pushNamed('/client-visit');
        break;
      case 2:
        Navigator.of(context).pushNamed('/notifications');
        break;
      case 3:
        Navigator.of(context).pushNamed('/profile');
        break;
    }
  }
}
