// src/screens/LoginScreen.js - User authentication screen
// Handles login form with validation using Formik and Yup

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/authSlice';
import { Feather } from '@expo/vector-icons';

// Validation schema using Yup
// Defines rules for username and password fields
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const dispatch = useDispatch();
  
  // Get loading and error states from Redux
  const { loading, error } = useSelector((state) => state.auth);

  /**
   * Handle form submission
   * @param {Object} values - Form values { username, password }
   */
  const handleLogin = async (values) => {
    // Dispatch login action (async thunk)
    const result = await dispatch(login(values));
    
    // Check if login failed
    if (result.type === 'auth/login/rejected') {
      // Show error alert
      Alert.alert('Login Failed', error || 'Invalid credentials');
    }
    // If successful, navigation happens automatically via AppNavigator
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Feather name="dribbble" size={50} color="#fff" />
          </View>
          <Text style={styles.title}>Sportify Mini</Text>
          <Text style={styles.subtitle}>Your Sports Companion</Text>
        </View>

        {/* Login Form using Formik */}
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#9CA3AF"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {/* Show validation error if username is touched and invalid */}
              {touched.username && errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {/* Show validation error if password is touched and invalid */}
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Demo Credentials Info */}
              <View style={styles.demoInfo}>
                <Text style={styles.demoText}>Demo Credentials:</Text>
                <Text style={styles.demoCredentials}>
                  Username: emilys {'\n'}Password: emilyspass
                </Text>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  demoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 8,
  },
  demoCredentials: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});