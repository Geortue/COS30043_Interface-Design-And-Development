<template>
  <div class="page-container container-fluid min-vh-100 d-flex align-items-center">
    <div class="row w-100">
      <div
        class="col-md-6 d-none d-md-flex align-items-center justify-content-center"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/906/906175.png"
          alt="Developer Illustration"
          class="img-fluid auth-illustration"
        />
      </div>
      <div class="col-md-6 d-flex align-items-center justify-content-center">
        <div
          class="auth-card shadow p-4 rounded-4 bg-white w-100"
          style="max-width: 400px"
        >
          <!-- Login Form -->
          <form v-if="mode === 'login'" @submit.prevent="handleLogin">
            <div class="text-center mb-4">
              <h4 class="fw-bold">Log into your account</h4>
            </div>
            <div class="mb-3">
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="Email"
                class="form-control rounded-pill"
                required
              />
            </div>
            <div class="mb-3">
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="Password"
                class="form-control rounded-pill"
                required
              />
            </div>
            <button class="btn btn-gradient w-100 rounded-pill text-white">Log In</button>
            <p v-if="loginForm.error" class="text-danger text-center mt-2">
              {{ loginForm.error }}
            </p>
            <div class="d-flex justify-content-between mt-3">
              <a href="#" class="small">Forgot Password?</a>
              <a
                href="#"
                class="small text-primary"
                @click.prevent="mode = 'register'"
                >Sign Up</a
              >
            </div>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister">
            <div class="text-center mb-4">
              <h4 class="fw-bold">Create a new account</h4>
            </div>
            <div class="row">
              <div class="col">
                <input
                  v-model="registerForm.firstName"
                  placeholder="First Name"
                  class="form-control rounded-pill mb-2"
                  required
                />
              </div>
              <div class="col">
                <input
                  v-model="registerForm.lastName"
                  placeholder="Last Name"
                  class="form-control rounded-pill mb-2"
                  required
                />
              </div>
            </div>
            <input
              v-model="registerForm.email"
              type="email"
              placeholder="Email"
              class="form-control rounded-pill mb-2"
              required
            />
            <div class="input-group mb-2">
              <input
                :type="registerForm.showPassword ? 'text' : 'password'"
                v-model="registerForm.password"
                placeholder="Password"
                class="form-control rounded-pill"
                required
              />
            </div>
            <select
              v-model="registerForm.role"
              class="form-select rounded-pill mb-3"
              required
            >
              <option disabled value="">Select Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
            <button class="btn btn-gradient w-100 rounded-pill">
              Register
            </button>
            <p
              v-if="registerForm.message"
              class="text-success text-center mt-2"
            >
              {{ registerForm.message }}
            </p>
            <p v-if="registerForm.error" class="text-danger text-center mt-2">
              {{ registerForm.error }}
            </p>
            <div class="text-center mt-3">
              <a href="#" class="small" @click.prevent="mode = 'login'">
                Already have an account? Log In
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Auth",
  data() {
    return {
      mode: "login",
      loginForm: {
        email: "",
        password: "",
        error: "",
      },
      registerForm: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        showPassword: false,
        message: "",
        error: "",
      },
    };
  },
  methods: {
    ...mapActions("auth", ["login", "register"]),

    async handleLogin() {
      try {
        this.loginForm.error = "";
        await this.login({
          email: this.loginForm.email.trim(),
          password: this.loginForm.password.trim(),
        });
        this.$router.push("/dashboard");
      } catch (err) {
        this.loginForm.error = "Invalid email or password";
      }
    },

    async handleRegister() {
      this.registerForm.message = "";
      this.registerForm.error = "";
      try {
        await this.register({
          first_name: this.registerForm.firstName.trim(),
          last_name: this.registerForm.lastName.trim(),
          email: this.registerForm.email.trim(),
          password_hash: this.registerForm.password.trim(),
          role: this.registerForm.role,
        });

        this.registerForm.message = "Registration successful! Redirecting...";

        // Reset the form
        Object.assign(this.registerForm, {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
          showPassword: false,
        });

        setTimeout(() => this.$router.push("/dashboard"), 1000);
      } catch (err) {
        this.registerForm.error =
          err?.response?.data?.error ||
          "Email already exists or registration failed.";
      }
    },
  },
};
</script>

<style scoped>
.auth-card {
  border: 1px solid #e0e0e0;
}
.auth-illustration {
  max-width: 60%;
}
</style>
