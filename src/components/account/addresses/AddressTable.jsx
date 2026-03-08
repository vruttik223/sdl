import AccountContext from '@/helper/accountContext';
import { useContext } from 'react';
import { Table } from 'reactstrap';

const AddressTable = ({ address }) => {
  const { accountData } = useContext(AccountContext);
  return (
    <div>
      {/* <div className="label">
        <label>{address?.title}</label>
      </div> */}
      <div className="table-responsive address-table">
        <Table>
          <tbody>
            <tr>
              <td>
                <div className="d-flex justify-content-between alihn-items-center pe-2">
                  Name <span>:</span>
                </div>
              </td>
              <td colSpan="2">{accountData?.name}</td>
            </tr>
            <tr>
              <td>
                <div className="d-flex justify-content-between alihn-items-center pe-2">
                  Address <span>:</span>
                </div>
              </td>
              <td>
                <p>
                  {address?.street}, {address?.city}, {address?.state?.name},{' '}
                  {address?.country?.name}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <div className="d-flex justify-content-between alihn-items-center pe-2">
                  Phone <span>:</span>
                </div>
              </td>
              <td>
                +{address?.country_code} {address?.phone}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AddressTable;
