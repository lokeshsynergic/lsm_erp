/**

- EMPLOYEE MODULE - API ENDPOINTS DOCUMENTATION
-
- Base URL: http://localhost:3000/employee
  */

/**

- 1.  CREATE EMPLOYEE (Add)
- POST /employee
-
- Request Body:
- {
- "emp_code": "EMP001",
- "emp_name": "John Doe",
- "catg_id": 1,
- "dob": "1990-01-15",
- "join_dt": "2023-01-01",
- "desig_id": 5,
- "dept_id": 2,
- "gender": "M",
- "phone_no": "9876543210",
- "email": "john@example.com",
- "pan_no": "AAAPB1234C",
- "aadhar_no": "123456789012",
- "emp_addr": "123 Main St",
- "pin_no": 110001,
- "bank_name": "HDFC",
- "bank_ac_no": "1234567890",
- "ifsc": "HDFC0001234",
- "pf_ac_no": "PF12345",
- "UAN": "UAN12345678",
- "basic_pay": 50000.00,
- "target": 100000.00,
- "half_yearly": 50000.00,
- "yearly": 100000.00,
- "emp_status": "A",
- "salary_status": 1,
- "remarks": "New employee"
- }
-
- Response: 201 CREATED
- {
- "id": 1,
- "emp_code": "EMP001",
- "emp_name": "John Doe",
- ...
- "created_dt": "2024-01-15T10:30:00.000Z"
- }
  */

/**

- 2. GET ALL EMPLOYEES (List)
- GET /employee
-
- Response: 200 OK
- [
- {
-     "id": 1,
-     "emp_code": "EMP001",
-     "emp_name": "John Doe",
-     ...
- },
- ...
- ]
  */

/**

- 3. GET ACTIVE EMPLOYEES
- GET /employee/active
-
- Response: 200 OK
- [
- {
-     "id": 1,
-     "emp_code": "EMP001",
-     "emp_name": "John Doe",
-     "emp_status": "A",
-     ...
- }
- ]
  */

/**

- 4. GET EMPLOYEE BY ID
- GET /employee/:id
-
- Example: GET /employee/1
- Response: 200 OK
- {
- "id": 1,
- "emp_code": "EMP001",
- "emp_name": "John Doe",
- ...
- }
  */

/**

- 5. GET EMPLOYEE BY EMPLOYEE CODE
- GET /employee/code/:empCode
-
- Example: GET /employee/code/EMP001
- Response: 200 OK
- {
- "id": 1,
- "emp_code": "EMP001",
- "emp_name": "John Doe",
- ...
- }
  */

/**

- 6. UPDATE EMPLOYEE (Edit)
- PUT /employee/:id
-
- Example: PUT /employee/1
- Request Body (all fields optional):
- {
- "emp_name": "Jane Doe",
- "phone_no": "9876543211",
- "email": "jane@example.com",
- ...
- }
-
- Response: 200 OK
- {
- "id": 1,
- "emp_code": "EMP001",
- "emp_name": "Jane Doe",
- ...
- "modified_dt": "2024-01-16T11:00:00.000Z"
- }
  */

/**

- 7. DELETE EMPLOYEE
- DELETE /employee/:id
-
- Example: DELETE /employee/1
- Response: 204 NO CONTENT
  */

/**

- ERROR RESPONSES:
-
- 400 Bad Request:
- {
- "statusCode": 400,
- "message": "Validation failed",
- "error": "Bad Request"
- }
-
- 404 Not Found:
- {
- "statusCode": 404,
- "message": "Employee with ID 999 not found",
- "error": "Not Found"
- }
-
- 409 Conflict (duplicate emp_code):
- {
- "statusCode": 409,
- "message": "Employee code already exists",
- "error": "Conflict"
- }
  */
