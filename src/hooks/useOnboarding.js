import { useEffect } from "react";

export function useOnboarding(user, organization, compliance, drivers) {
  // Day 0 email on first login
  useEffect(() => {
    if (!user) return;
    const sentKey = `cos_onboard_email_${user.id}`;
    if (localStorage.getItem(sentKey)) return;
    const email = user.emailAddresses?.[0]?.emailAddress;
    const name = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "";
    if (!email) return;
    localStorage.setItem(sentKey, "1");
    fetch("/api/onboarding-email", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({email, name, day: 0, companyName: organization?.name || ""})
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Day 3 and Day 7 emails
  useEffect(() => {
    if (!user) return;
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) return;
    const signupDateKey = `cos_signup_date_${user.id}`;
    if (!localStorage.getItem(signupDateKey)) {
      localStorage.setItem(signupDateKey, Date.now().toString());
    }
    const signupDate = parseInt(localStorage.getItem(signupDateKey) || "0");
    const daysSince = (Date.now() - signupDate) / (1000 * 60 * 60 * 24);
    const sendEmail = (day) => {
      const sentKey = `cos_onboard_email_day${day}_${user.id}`;
      if (localStorage.getItem(sentKey)) return;
      localStorage.setItem(sentKey, "1");
      fetch("/api/onboarding-email", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email, name: user.firstName || "", day,
          companyName: organization?.name || "",
          hasDrivers: drivers.length > 0,
          hasTrucks: compliance?.trucks?.length > 0
        })
      }).catch(() => {});
    };
    if (daysSince >= 3) sendEmail(3);
    if (daysSince >= 7) sendEmail(7);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, drivers.length, compliance?.trucks?.length]);
}
