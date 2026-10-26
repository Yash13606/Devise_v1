-- Depends on 001 core and 002 governance's append-only audit_entries.
CREATE TABLE spend_records(id uuid PRIMARY KEY,org_id uuid NOT NULL REFERENCES organizations(id),source_id text NOT NULL,payload jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(org_id,source_id));
CREATE TABLE retention_previews(id uuid PRIMARY KEY,org_id uuid NOT NULL REFERENCES organizations(id),subject text NOT NULL,event_ids uuid[] NOT NULL,cutoff timestamptz NOT NULL,expires_at timestamptz NOT NULL,used_at timestamptz);
ALTER TABLE spend_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE spend_records FORCE ROW LEVEL SECURITY;
CREATE POLICY spend_scope ON spend_records USING(org_id::text=current_setting('app.org_id',true)) WITH CHECK(org_id::text=current_setting('app.org_id',true));
ALTER TABLE retention_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE retention_previews FORCE ROW LEVEL SECURITY;
CREATE POLICY preview_scope ON retention_previews USING(org_id::text=current_setting('app.org_id',true)) WITH CHECK(org_id::text=current_setting('app.org_id',true));
REVOKE ALL ON spend_records,retention_previews FROM PUBLIC;
GRANT SELECT,INSERT ON spend_records TO devise_app;
GRANT SELECT,INSERT,UPDATE,DELETE ON retention_previews TO devise_app;
CREATE INDEX spend_org_created ON spend_records(org_id,created_at DESC);
-- Team read is scoped to the trusted, server-resolved selected organization.
CREATE POLICY member_team_read ON memberships FOR SELECT USING(org_id::text=current_setting('app.org_id',true));
CREATE POLICY user_team_read ON users FOR SELECT USING(EXISTS(SELECT 1 FROM memberships m WHERE m.subject=users.subject AND m.org_id::text=current_setting('app.org_id',true)));
CREATE POLICY own_profile_update ON users FOR UPDATE USING(subject=current_setting('app.subject',true)) WITH CHECK(subject=current_setting('app.subject',true));
CREATE POLICY org_settings_update ON organizations FOR UPDATE USING(id::text=current_setting('app.org_id',true)) WITH CHECK(id::text=current_setting('app.org_id',true));
GRANT UPDATE(name) ON users TO devise_app;
GRANT UPDATE(settings) ON organizations TO devise_app;
