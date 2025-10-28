async function doLogout() {
  const res = await fetch("{% url 'logout' %}", {
    method: "POST",
    headers: { "X-CSRFToken": getCookie("csrftoken") }
  });

  // If you kept Django's LogoutView instead of your custom one:
  if (res.redirected) {
    window.location.href = res.url;
    return;
  }

  // If using the JsonResponse above:
  const data = await res.json().catch(() => ({}));
  window.location.href = data.redirect_url || "{% url 'home' %}";
}