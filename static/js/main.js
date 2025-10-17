// Dynamically import scenes based on page
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    switch (page) {
        case 'home':
            import('./scenes/torusScene-BqgLl7re.js').then(m => m.initTorusScene());
            break;
        case 'signUp':
            import('./scenes/signUpScene-CFsR6nbo.js').then(m => m.initSignUpScene());
            break;
        case 'profiles':
            import('./scenes/profilesScene-CPNPKGWT.js').then(m => m.initProfilesScene());
            break;
        case 'edit_profile':
            import('./scenes/profilesScene-CPNPKGWT.js').then(m => m.initProfilesScene());
            break;
        default:
            console.warn('No scene assigned for this page:', page);
    }
});