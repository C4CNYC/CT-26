export const TENANT_PATH_BUILDER = {
  root: (org_id: string): string => `tenant_${org_id}/org`,
  users: (org_id: string): string => `tenant_${org_id}/users`,
  students: (org_id: string): string => `tenant_${org_id}/students`,
  author: (org_id: string, id: string): string =>
    `tenant_${org_id}/authors/${id}`,
  schools: (org_id: string, id: string): string =>
    `tenant_${org_id}/schools/${id}`,
  courses: (org_id: string, id: string): string =>
    `tenant_${org_id}/courses/${id}`,
  courseUnits: (org_id: string, id: string): string =>
    `tenant_${org_id}/course-units/${id}`,
  envs: (org_id: string, envid: string): string =>
    `tenant_${org_id}/envs/${envid}`,
}
