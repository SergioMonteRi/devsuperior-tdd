import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AxiosRequestConfig } from 'axios';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';

import { hasAnyRoles } from 'util/auth';
import { requestBackend } from 'util/requests';

import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';

import './styles.css';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0,
    });

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: 3,
      },
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({ activePage: pageNumber });
  };

  return (
    <>
      <Link to="/admin/employees/create">
        {hasAnyRoles(['ROLE_ADMIN']) && (
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        )}
      </Link>

      {page?.content.map((employee) => (
        <EmployeeCard employee={employee} key={employee.id} />
      ))}

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
