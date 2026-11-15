// api/_lib/clerkAuth.js
// Shared helper: confirms a request really comes from a signed-in Clerk user who
// belongs to the company (organization) they claim to act for.
// Files that start with "_" inside /api are NOT turned into endpoints by Vercel.

const { createClerkClient, verifyToken } = require("@clerk/backend");

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Reads the "Authorization: Bearer <token>" header and verifies it with Clerk.
async function getVerifiedUserId(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) throw httpError(401, "Please sign in again.");

  let claims;
  try {
    const result = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    // Some versions return the claims directly, others return { data, error }.
    claims = result && result.data ? result.data : result;
  } catch (e) {
    throw httpError(401, "Your session expired. Please sign in again.");
  }

  if (!claims || !claims.sub) {
    throw httpError(401, "Your session expired. Please sign in again.");
  }
  return claims.sub;
}

// Verifies the login AND that this user is a member of the given company.
async function requireOrgMember(req, orgId) {
  if (!orgId) throw httpError(400, "Missing company ID.");
  const userId = await getVerifiedUserId(req);

  const res = await clerk.users.getOrganizationMembershipList({
    userId,
    limit: 100,
  });
  // Newer versions return { data, totalCount }; older ones return an array.
  const memberships = Array.isArray(res) ? res : (res && res.data) || [];
  const isMember = memberships.some(
    (m) => m.organization && m.organization.id === orgId
  );
  if (!isMember) throw httpError(403, "You are not a member of this company.");
  return userId;
}

function sendError(res, err) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  return res
    .status(status)
    .json({ error: err.message || "Something went wrong." });
}

module.exports = { requireOrgMember, sendError, httpError };
