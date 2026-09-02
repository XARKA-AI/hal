/**
 * Legacy URLs from the previous HAL PHP site (still in Google sitelinks).
 * Keep vercel.json redirects in sync with this list.
 */
export const LEGACY_REDIRECTS: ReadonlyArray<{ from: string; to: string }> = [
  // Company Profile / About Us
  { from: "/about-us", to: "/about" },
  { from: "/about-us.php", to: "/about" },
  { from: "/about.php", to: "/about" },
  { from: "/aboutus", to: "/about" },
  { from: "/aboutus.php", to: "/about" },
  { from: "/company-profile", to: "/about" },
  { from: "/company-profile.php", to: "/about" },
  { from: "/companyprofile", to: "/about" },
  { from: "/companyprofile.php", to: "/about" },

  // Submit CV / vacancies
  { from: "/submit-cv", to: "/careers#upload" },
  { from: "/submit-cv.php", to: "/careers#upload" },
  { from: "/submitcv", to: "/careers#upload" },
  { from: "/submitcv.php", to: "/careers#upload" },
  { from: "/current-vacancy", to: "/careers" },
  { from: "/current-vacancy.php", to: "/careers" },
  { from: "/current-vacancies", to: "/careers" },
  { from: "/current-vacancies.php", to: "/careers" },
  { from: "/career", to: "/careers" },
  { from: "/career.php", to: "/careers" },
  { from: "/careers.php", to: "/careers" },
  { from: "/vacancy", to: "/careers" },
  { from: "/vacancies", to: "/careers" },

  // Contact
  { from: "/contact-us", to: "/contact" },
  { from: "/contact-us.php", to: "/contact" },
  { from: "/contact.php", to: "/contact" },
  { from: "/contactus", to: "/contact" },
  { from: "/contactus.php", to: "/contact" },

  // Fleet (homepage sister-company / fleet section)
  { from: "/fleet", to: "/#fleet" },
  { from: "/fleet.php", to: "/#fleet" },

  // Old home
  { from: "/index.php", to: "/" },
  { from: "/home", to: "/" },
  { from: "/home.php", to: "/" },
]
