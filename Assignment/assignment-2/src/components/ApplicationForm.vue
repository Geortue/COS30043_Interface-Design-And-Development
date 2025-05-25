<template>
  <form
    ref="applicationForm"
    method="post"
    action="http://mercury.swin.edu.au/it000000/formtest.php"
    @submit.prevent="validateForm"
    class="mt-4"
  >
    <fieldset class="mb-4">
      <legend>Personal Information</legend>

      <div class="row">
        <div class="col-md-6">
          <label for="firstName" class="form-label">First Name</label>
          <input
            id="firstName"
            type="text"
            v-model="form.firstName"
            placeholder="Enter your first name"
            class="form-control mb-2"
            required
            pattern="[A-Za-z]+"
            name="firstName"
          />
          <div v-if="errors.firstName" class="text-danger ms-1">
            {{ errors.firstName }}
          </div>
        </div>

        <div class="col-md-6">
          <label for="lastName" class="form-label">Last Name</label>
          <input
            id="lastName"
            type="text"
            v-model="form.lastName"
            placeholder="Enter your last name"
            class="form-control mb-2"
            required
            pattern="[A-Za-z]+"
            name="lastName"
          />
          <div v-if="errors.lastName" class="text-danger ms-1">
            {{ errors.lastName }}
          </div>
        </div>
      </div>

      <div>
        <label for="dob" class="form-label">Date of Birth</label>
        <input
          id="dob"
          type="date"
          v-model="form.dob"
          class="form-control mb-2"
          required
          name="dob"
        />
        <div v-if="errors.dob" class="text-danger ms-1">
          {{ errors.dob }}
        </div>
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend>Account Details</legend>

      <label for="username" class="form-label">Username</label>
      <input
        id="username"
        type="text"
        v-model="form.username"
        placeholder="Choose a username"
        class="form-control mb-2"
        required
        minlength="3"
        name="username"
      />
      <div v-if="errors.username" class="text-danger ms-1">
        {{ errors.username }}
      </div>

      <label for="email" class="form-label mt-3">Email</label>
      <input
        id="email"
        type="email"
        v-model="form.email"
        placeholder="Enter your email address"
        class="form-control mb-2"
        required
        name="email"
      />
      <div v-if="errors.email" class="text-danger ms-1">
        {{ errors.email }}
      </div>

      <label for="password" class="form-label">Password</label>
      <input
        id="password"
        type="password"
        v-model="form.password"
        placeholder="Enter your password"
        class="form-control mb-2"
        required
        pattern="(?=.*[^A-Za-z0-9]).{8,}"
        name="password"
      />

      <div v-if="errors.password" class="text-danger ms-1">
        {{ errors.password }}
      </div>

      <label for="confirmPassword" class="form-label">Confirm Password</label>
      <input
        id="confirmPassword"
        type="password"
        v-model="form.confirmPassword"
        placeholder="Confirm your password"
        class="form-control mb-2"
        required
        name="confirmPassword"
      />
      <div v-if="errors.confirmPassword" class="text-danger ms-1">
        {{ errors.confirmPassword }}
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend>Address</legend>

      <label for="address" class="form-label">Street Address (Optional)</label>
      <input
        id="address"
        type="text"
        v-model="form.address"
        placeholder="Enter your street address"
        class="form-control mb-2"
        maxlength="40"
        name="address"
      />

      <div class="row">
        <div class="col-md-6">
          <label for="suburb" class="form-label">Suburb (Optional)</label>
          <input
            id="suburb"
            type="text"
            v-model="form.suburb"
            placeholder="Enter suburb"
            class="form-control mb-2"
            maxlength="20"
            name="suburb"
          />
        </div>

        <div class="col-md-6">
          <label for="postcode" class="form-label">Postcode</label>
          <input
            id="postcode"
            type="text"
            v-model="form.postcode"
            placeholder="4-digit postcode"
            class="form-control mb-2"
            pattern="[0-9]{4}"
            required
            name="postcode"
          />
          <div v-if="errors.postcode" class="text-danger ms-1">
            {{ errors.postcode }}
          </div>
        </div>
      </div>

      <label for="mobile" class="form-label">Mobile Number</label>
      <input
        id="mobile"
        type="text"
        v-model="form.mobile"
        placeholder="Format: 04xxxxxxxx"
        class="form-control mb-2"
        pattern="04[0-9]{8}"
        required
        name="mobile"
      />
      <div v-if="errors.mobile" class="text-danger ms-1">
        {{ errors.mobile }}
      </div>
    </fieldset>

    <fieldset class="mb-4">
      <legend>Preferred Job Category</legend>

      <label for="category" class="form-label">Select Category</label>
      <select
        id="category"
        v-model="form.category"
        class="form-select mb-2"
        name="category"
        required
      >
        <option value="">Select a category...</option>
        <option>AI</option>
        <option>Data Science</option>
        <option>Web Development</option>
      </select>
      <div v-if="errors.category" class="text-danger ms-1">
        {{ errors.category }}
      </div>
    </fieldset>

    <button type="submit" class="btn btn-success">Submit</button>
    <button
      type="button"
      @click="showTerms = !showTerms"
      class="btn btn-info ms-2"
    >
      Terms and Conditions
    </button>

    <div v-if="showTerms" class="alert alert-info mt-3">
      <strong>Accuracy of Information:</strong> Applicants agree to provide
      truthful and complete information in their application and resume.
      <br />
      <strong>Data Privacy:</strong> By applying, candidates consent to the
      collection and processing of their personal data in accordance with the
      company's privacy policy. <br />
      <strong>Background Checks:</strong> Applicants may allow prospective
      employers to conduct background checks, including reference checks or
      criminal history. <br />
      <strong>No Guarantee of Employment:</strong> Submission of an application
      does not guarantee that the applicant will be interviewed or hired.
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        address: "",
        suburb: "",
        postcode: "",
        mobile: "",
        dob: "",
        category: "",
      },
      errors: {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        postcode: "",
        mobile: "",
        dob: "",
        category: "",
      },
      showTerms: false,
    };
  },
  methods: {
    validateForm() {
      let hasErrors = false;
      this.errors = {
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        postcode: "",
        mobile: "",
        dob: "",
        category: "",
      };

      if (!this.form.firstName.match(/^[A-Za-z]+$/)) {
        this.errors.firstName = "First name must contain only letters.";
        hasErrors = true;
      }

      if (!this.form.lastName.match(/^[A-Za-z]+$/)) {
        this.errors.lastName = "Last name must contain only letters.";
        hasErrors = true;
      }

      if (this.form.username.length < 3) {
        this.errors.username = "Username must be at least 3 characters.";
        hasErrors = true;
      }

      if (
        this.form.password.length < 8 ||
        !this.form.password.match(/[^A-Za-z0-9]/)
      ) {
        this.errors.password =
          "Minimum 8 characters, must include at least one special character.";
        hasErrors = true;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords must match.";
        hasErrors = true;
      }

      const dob = new Date(this.form.dob);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (age < 16) {
        this.errors.dob = "You must be at least 16 years old.";
        hasErrors = true;
      }

      if (
        !this.form.email.match(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        )
      ) {
        this.errors.email = "Invalid email address.";
        hasErrors = true;
      }

      if (!this.form.postcode.match(/^\d{4}$/)) {
        this.errors.postcode = "Postcode must be a 4-digit number.";
        hasErrors = true;
      }

      if (!this.form.mobile.match(/^04\d{8}$/)) {
        this.errors.mobile = "Mobile number must be in 04xxxxxxxx format.";
        hasErrors = true;
      }

      if (!this.form.category) {
        this.errors.category = "Please select a job category.";
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      this.$refs.applicationForm.submit();
    },
  },
};
</script>
