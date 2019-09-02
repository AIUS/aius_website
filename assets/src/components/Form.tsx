import * as React from 'react';

export const Form = () => (
  <form>
    <div className="field">
      <label className="label">Name</label>
      <div className="control">
        <input className="input" type="text" placeholder="e.g John Doe" />
      </div>
    </div>

    <div className="field">
      <label className="label">Email</label>
      <div className="control">
        <input className="input" type="email" placeholder="e.g. john.doe@etu.unistra.fr" />
      </div>
    </div>
  </form>
);

export default Form;
