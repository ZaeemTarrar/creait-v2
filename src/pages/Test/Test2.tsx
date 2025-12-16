// import FormInput from "../../components/FormInput/FormInput";
// import type { Phase, PrimaryQuestion } from "../../store/features/questions/types";
// import { useAppSelector } from "../../store/hooks";

// const Test2 = () => {
//   const survey = useAppSelector((state) => state.questions.survey);

//   const getPrimaryQuestionsByPhaseId = (id: number): PrimaryQuestion[] | undefined => {
//     const [phase] = survey.phases.filter((phase: Phase) => phase.id == id);
//     if (phase) return phase.primary_questions;
//     else return undefined;
//   };

//   // Single handler for all input changes
//   const handleInputChange = (name: string, value: string | string[] | number, isValid: boolean) => {
//     console.log("Input Change:", {
//       field: name,
//       value: value,
//       type: typeof value,
//       isValid: isValid,
//       timestamp: new Date().toISOString(),
//     });
//   };

//   // Single handler for all blur events
//   const handleInputBlur = (name: string, value: string | string[] | number) => {
//     console.log("Input Blur:", {
//       field: name,
//       value: value,
//       event: "blur",
//       timestamp: new Date().toISOString(),
//     });
//   };

//   return (
//     <>
//       <div className="container mt-5">
//         <pre>{JSON.stringify(getPrimaryQuestionsByPhaseId(1), null, 3)}</pre>

//         <div className="row justify-content-center">
//           <div className="col-lg-10">
//             <div className="card shadow">
//               <div className="card-header bg-primary text-white">
//                 <h2 className="h4 mb-0">Form Input Component Demo</h2>
//                 <p className="mb-0 opacity-75">All input types with comprehensive options</p>
//               </div>

//               <div className="card-body">
//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">1. Text Input</h3>
//                   <FormInput
//                     type="text"
//                     name="fullName"
//                     label="Full Name"
//                     placeholder="Enter your name"
//                     defaultValue="John Doe"
//                     validation={[
//                       { type: "required", message: "Name is required" },
//                       { type: "minLength", value: 2, message: "Must be at least 2 characters" },
//                       { type: "maxLength", value: 50, message: "Cannot exceed 50 characters" },
//                     ]}
//                     required={true}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     disabled={false}
//                     helpText="Enter your first and last name"
//                     className=""
//                     containerClassName=""
//                     labelClassName="fw-bold"
//                     errorClassName="text-danger"
//                   />
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">2. Email Input</h3>
//                   <FormInput
//                     type="email"
//                     name="email"
//                     label="Email Address"
//                     placeholder="your@email.com"
//                     validation={[
//                       { type: "required", message: "Email is required" },
//                       {
//                         type: "pattern",
//                         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                         message: "Please enter a valid email address",
//                       },
//                     ]}
//                     required={true}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     helpText="We'll never share your email with anyone else"
//                   />
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">3. Password Input</h3>
//                   <FormInput
//                     type="password"
//                     name="password"
//                     label="Password"
//                     placeholder="Enter a strong password"
//                     validation={[
//                       { type: "required", message: "Password is required" },
//                       {
//                         type: "minLength",
//                         value: 8,
//                         message: "Password must be at least 8 characters",
//                       },
//                       {
//                         type: "pattern",
//                         value: /^(?=.*[A-Za-z])(?=.*\d)/,
//                         message: "Password must contain at least one letter and one number",
//                       },
//                     ]}
//                     required={true}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     helpText="Minimum 8 characters with letters and numbers"
//                   />
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">4. Textarea</h3>
//                   <FormInput
//                     type="textarea"
//                     name="bio"
//                     label="Biography"
//                     placeholder="Tell us about yourself..."
//                     rows={4}
//                     validation={[
//                       {
//                         type: "maxLength",
//                         value: 500,
//                         message: "Bio cannot exceed 500 characters",
//                       },
//                     ]}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     helpText="Maximum 500 characters"
//                   />
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">5. Radio Buttons</h3>
//                   <FormInput
//                     type="radio"
//                     name="gender"
//                     label="Gender"
//                     options={[
//                       { value: "male", label: "Male" },
//                       { value: "female", label: "Female" },
//                       { value: "other", label: "Other" },
//                       { value: "prefer-not", label: "Prefer not to say" },
//                     ]}
//                     required={true}
//                     inline={true}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     helpText="Select your gender"
//                   />
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">6. Checkboxes</h3>
//                   <FormInput
//                     type="checkbox"
//                     name="interests"
//                     label="Interests"
//                     options={[
//                       { value: "tech", label: "Technology" },
//                       { value: "sports", label: "Sports" },
//                       { value: "music", label: "Music" },
//                       { value: "travel", label: "Travel" },
//                       { value: "food", label: "Food & Cooking" },
//                     ]}
//                     inline={true}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     helpText="Select all that apply"
//                   />
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">7. Range Sliders</h3>

//                   <div className="row g-4">
//                     <div className="col-md-6">
//                       <FormInput
//                         type="range"
//                         name="age"
//                         label="Age"
//                         rangeConfig={{
//                           min: 18,
//                           max: 100,
//                           step: 1,
//                           showValue: true,
//                           valueSuffix: " years",
//                         }}
//                         onChange={handleInputChange}
//                         onBlur={handleInputBlur}
//                         helpText="Slide to select your age"
//                       />
//                     </div>

//                     <div className="col-md-6">
//                       <FormInput
//                         type="range"
//                         name="satisfaction"
//                         label="Satisfaction Level"
//                         rangeConfig={{
//                           min: 0,
//                           max: 10,
//                           step: 0.5,
//                           showValue: true,
//                           valuePrefix: "Score: ",
//                         }}
//                         onChange={handleInputChange}
//                         onBlur={handleInputBlur}
//                         helpText="How satisfied are you with our service?"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mb-4 border-bottom pb-4">
//                   <h3 className="h5 mb-3 text-primary">8. Dropdown (Select)</h3>
//                   <FormInput
//                     type="dropdown"
//                     name="country"
//                     label="Country"
//                     options={[
//                       { value: "us", label: "United States" },
//                       { value: "uk", label: "United Kingdom" },
//                       { value: "ca", label: "Canada" },
//                       { value: "au", label: "Australia" },
//                       { value: "de", label: "Germany" },
//                     ]}
//                     placeholder="Select your country"
//                     required={true}
//                     onChange={handleInputChange}
//                     onBlur={handleInputBlur}
//                     helpText="Choose your country of residence"
//                   />
//                 </div>
//               </div>

//               <div className="card-footer bg-light">
//                 <div className="alert alert-info mb-0">
//                   <h5 className="alert-heading">Console Output</h5>
//                   <p className="mb-0">
//                     Open browser console to see onChange and onBlur events. Every interaction will
//                     log:
//                   </p>
//                   <ul className="mb-0">
//                     <li>Field name</li>
//                     <li>Current value</li>
//                     <li>Value type</li>
//                     <li>Validation status</li>
//                     <li>Timestamp</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Test2;
