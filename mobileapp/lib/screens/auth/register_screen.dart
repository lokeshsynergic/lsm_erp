import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';
import '../../services/auth_service.dart';
import '../../services/api_client.dart';
import '../../services/device_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _currentStep = 0; // 0: User verification, 1: Password entry

  final _userIdController = TextEditingController();
  final _dobController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _isLoading = false;
  String? _fullName;
  String? _errorMessage;

  late AuthService _authService;

  @override
  void initState() {
    super.initState();
    _authService = AuthService(Provider.of<ApiClient>(context, listen: false));
  }

  @override
  void dispose() {
    _userIdController.dispose();
    _dobController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  bool _isValidPassword(String password) {
    final regex = RegExp(
      r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$',
    );
    return regex.hasMatch(password);
  }

  String _getPasswordError(String password) {
    if (password.isEmpty) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!password.contains(RegExp(r'[a-z]')))
      return 'Must contain lowercase letter';
    if (!password.contains(RegExp(r'[A-Z]')))
      return 'Must contain uppercase letter';
    if (!password.contains(RegExp(r'\d'))) return 'Must contain number';
    if (!password.contains(RegExp(r'[@$!%*?&]')))
      return 'Must contain special character (@\$!%*?&)';
    return '';
  }

  Future<void> _handleCheckUser() async {
    if (_userIdController.text.isEmpty || _dobController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter User ID and Date of Birth';
      });
      return;
    }

    setState(() => _isLoading = true);

    try {
      print(
        'Checking user with ID: ${_userIdController.text} and DOB: ${_dobController.text}',
      );
      final result = await _authService.checkUser(
        userId: _userIdController.text,
        dob: _dobController.text,
      );

      if (result['exists'] == true) {
        setState(() {
          _currentStep = 1;
          _fullName = result['fullName'];
          _errorMessage = null;
        });
      } else {
        setState(() {
          _errorMessage = 'User not found. Please verify your ID and DOB.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleRegister() async {
    if (!_isValidPassword(_passwordController.text)) {
      setState(() {
        _errorMessage = _getPasswordError(_passwordController.text);
      });
      return;
    }

    setState(() => _isLoading = true);

    try {
      final String deviceId = await DeviceService.getOrCreateDeviceId();

      final apiResponse = await _authService.mobileRegister(
        userId: _userIdController.text,
        password: _passwordController.text,
        usertype: 'U', // Default user type
        deviceId: deviceId, // You can replace this with actual device ID
      );
      print('Registration successful: $apiResponse');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('ok'), backgroundColor: Colors.green),
        );
        Navigator.of(context).pushReplacementNamed('/login');
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceAll('Exception: ', '');
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(gradient: AppColors.primaryGradient),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 40),
                  // Header
                  Center(
                    child: Column(
                      children: [
                        Text(
                          AppStrings.signUp,
                          style: GoogleFonts.poppins(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: AppColors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _currentStep == 0
                              ? 'Verify your identity'
                              : 'Create your password',
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: AppColors.white.withOpacity(0.8),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                  // Register Card
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.white,
                      borderRadius: BorderRadius.circular(
                        AppConstants.largeBorderRadius,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 30,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(30),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Step indicator
                        Row(
                          children: [
                            _buildStepIndicator(0, 'Verify'),
                            Expanded(
                              child: Container(
                                height: 2,
                                color: _currentStep >= 1
                                    ? AppColors.primary
                                    : AppColors.greyLight,
                                margin: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                ),
                              ),
                            ),
                            _buildStepIndicator(1, 'Password'),
                          ],
                        ),
                        const SizedBox(height: 30),
                        // Error message
                        if (_errorMessage != null)
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.red),
                            ),
                            child: Text(
                              _errorMessage!,
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                color: Colors.red,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        if (_errorMessage != null) const SizedBox(height: 20),
                        // Step 1: User Verification
                        if (_currentStep == 0) ...[
                          // User ID Field
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'User ID',
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.greyDark,
                                ),
                              ),
                              const SizedBox(height: 8),
                              TextField(
                                controller: _userIdController,
                                decoration: InputDecoration(
                                  hintText: 'Enter your User ID',
                                  prefixIcon: const Icon(Icons.badge_outlined),
                                  prefixIconColor: AppColors.primary,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                keyboardType: TextInputType.text,
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                          // Date of Birth Field
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Date of Birth',
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.greyDark,
                                ),
                              ),
                              const SizedBox(height: 8),
                              TextField(
                                controller: _dobController,
                                decoration: InputDecoration(
                                  hintText: 'YYYY-MM-DD',
                                  prefixIcon: const Icon(
                                    Icons.calendar_today_outlined,
                                  ),
                                  prefixIconColor: AppColors.primary,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                keyboardType: TextInputType.datetime,
                              ),
                            ],
                          ),
                          const SizedBox(height: 28),
                          // Continue Button
                          ElevatedButton.icon(
                            onPressed: _isLoading ? null : _handleCheckUser,
                            icon: _isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        AppColors.white,
                                      ),
                                    ),
                                  )
                                : const Icon(Icons.arrow_forward),
                            label: Text(
                              _isLoading ? 'Verifying...' : 'Continue',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              backgroundColor: AppColors.primary,
                            ),
                          ),
                        ] else ...[
                          // Step 2: Password Entry
                          // Display verified user name
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.primary),
                            ),
                            child: Column(
                              children: [
                                const Icon(
                                  Icons.check_circle,
                                  color: AppColors.primary,
                                  size: 32,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Welcome',
                                  style: GoogleFonts.poppins(
                                    fontSize: 14,
                                    color: AppColors.greyDark,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _fullName ?? '',
                                  style: GoogleFonts.poppins(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 30),
                          // Password Field
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Create Password',
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.greyDark,
                                ),
                              ),
                              const SizedBox(height: 8),
                              TextField(
                                controller: _passwordController,
                                obscureText: _obscurePassword,
                                onChanged: (_) => setState(() {}),
                                decoration: InputDecoration(
                                  hintText: '••••••••',
                                  prefixIcon: const Icon(Icons.lock_outlined),
                                  prefixIconColor: AppColors.primary,
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  suffixIcon: IconButton(
                                    icon: Icon(
                                      _obscurePassword
                                          ? Icons.visibility_off
                                          : Icons.visibility,
                                      color: AppColors.primary,
                                    ),
                                    onPressed: () {
                                      setState(() {
                                        _obscurePassword = !_obscurePassword;
                                      });
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          // Password Requirements
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.grey.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Password Requirements:',
                                  style: GoogleFonts.poppins(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.greyDark,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                _buildRequirementCheck(
                                  'At least 6 characters',
                                  _passwordController.text.length >= 6,
                                ),
                                _buildRequirementCheck(
                                  'One lowercase letter (a-z)',
                                  _passwordController.text.contains(
                                    RegExp(r'[a-z]'),
                                  ),
                                ),
                                _buildRequirementCheck(
                                  'One uppercase letter (A-Z)',
                                  _passwordController.text.contains(
                                    RegExp(r'[A-Z]'),
                                  ),
                                ),
                                _buildRequirementCheck(
                                  'One number (0-9)',
                                  _passwordController.text.contains(
                                    RegExp(r'\d'),
                                  ),
                                ),
                                _buildRequirementCheck(
                                  'One special character (@\$!%*?&)',
                                  _passwordController.text.contains(
                                    RegExp(r'[@$!%*?&]'),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 28),
                          // Register Button
                          ElevatedButton.icon(
                            onPressed: _isLoading
                                ? null
                                : (_isValidPassword(_passwordController.text)
                                      ? _handleRegister
                                      : null),
                            icon: _isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        AppColors.white,
                                      ),
                                    ),
                                  )
                                : const Icon(Icons.app_registration),
                            label: Text(
                              _isLoading
                                  ? 'Creating account...'
                                  : 'Complete Registration',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              backgroundColor: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 12),
                          // Back Button
                          OutlinedButton.icon(
                            onPressed: () {
                              setState(() {
                                _currentStep = 0;
                                _errorMessage = null;
                                _passwordController.clear();
                              });
                            },
                            icon: const Icon(Icons.arrow_back),
                            label: Text(
                              'Back',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              side: const BorderSide(color: AppColors.primary),
                            ),
                          ),
                        ],
                        const SizedBox(height: 20),
                        // Login Link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "${AppStrings.alreadyHaveAccount} ",
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                color: AppColors.greyDark,
                              ),
                            ),
                            GestureDetector(
                              onTap: () {
                                Navigator.of(context).pop();
                              },
                              child: Text(
                                AppStrings.signIn,
                                style: GoogleFonts.poppins(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicator(int step, String label) {
    final isActive = _currentStep == step;
    final isCompleted = _currentStep > step;

    return Column(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isActive || isCompleted
                ? AppColors.primary
                : AppColors.greyLight,
          ),
          child: Center(
            child: isCompleted
                ? const Icon(Icons.check, color: AppColors.white)
                : Text(
                    '${step + 1}',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppColors.white,
                    ),
                  ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: isActive || isCompleted
                ? AppColors.primary
                : AppColors.greyDark,
          ),
        ),
      ],
    );
  }

  Widget _buildRequirementCheck(String text, bool isValid) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(
            isValid ? Icons.check_circle : Icons.circle_outlined,
            color: isValid ? Colors.green : Colors.grey,
            size: 16,
          ),
          const SizedBox(width: 8),
          Text(
            text,
            style: GoogleFonts.poppins(
              fontSize: 12,
              color: isValid ? Colors.green : AppColors.greyDark,
            ),
          ),
        ],
      ),
    );
  }
}
