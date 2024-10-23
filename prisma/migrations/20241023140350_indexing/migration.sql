-- CreateIndex
CREATE INDEX "Group_groupName_idx" ON "Group"("groupName");

-- CreateIndex
CREATE INDEX "GroupRole_roleId_groupId_idx" ON "GroupRole"("roleId", "groupId");

-- CreateIndex
CREATE INDEX "GroupUser_groupId_userId_idx" ON "GroupUser"("groupId", "userId");

-- CreateIndex
CREATE INDEX "Permission_permissionLabel_idx" ON "Permission"("permissionLabel");

-- CreateIndex
CREATE INDEX "Role_roleLabel_idx" ON "Role"("roleLabel");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_permissionId_idx" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "RoleUser_roleId_userId_idx" ON "RoleUser"("roleId", "userId");

-- CreateIndex
CREATE INDEX "User_username_firstname_lastname_email_idx" ON "User"("username", "firstname", "lastname", "email");

-- CreateIndex
CREATE INDEX "UserPermission_userId_permissionId_idx" ON "UserPermission"("userId", "permissionId");
