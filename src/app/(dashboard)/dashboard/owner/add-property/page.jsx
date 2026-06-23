import React from 'react';
import AddPropertyClient from './AddPropertyClient';
import { getUserSession } from '@/lib/core/session';

const AddPropertyPage = async() => {
  const user = await getUserSession();
  return (
    <div>
      <AddPropertyClient owner={user}/>
    </div>
  );
};

export default AddPropertyPage;