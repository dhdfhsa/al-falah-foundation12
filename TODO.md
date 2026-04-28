# Fix Auth & Profile Icon

- [x] Fix `src/app/admin/login/page.tsx`: Store token in localStorage after login.
- [x] Fix `src/app/login/page.tsx`: Store token in localStorage after login.
- [x] Fix `src/app/api/auth/me/route.ts`: Include `profilePic` in admin response.
- [ ] Fix `src/components/Navbar.tsx`: Always check `/api/auth/me`, show `profilePic`, call logout API.
- [ ] Fix `src/app/dashboard/page.tsx`: Remove correct localStorage key on logout.
- [ ] Test login/logout and profile icon navigation.

