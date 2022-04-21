const jobsController = require('../../../src/controller/jobsController');
const jobService = require('../../../src/service/jobService');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe('getUnpaidJobs by profile', () => {
  describe('When profile is defined', () => {
    beforeEach(() => {
      jobService.getUnpaidJobsByProfile = jest.fn(async () => []);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should call jobService.getUnpaidJobsByProfile with correct params and respond correctly', async () => {
      const req = {
        profile: {
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      };
      const res = mockResponse();

      await jobsController.getUnpaidJobs(req, res);

      expect(jobService.getUnpaidJobsByProfile).toHaveBeenCalledWith({
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});

describe('payJobByJobId by profile and jobId', () => {
  describe('When the payment can be done', () => {
    beforeEach(() => {
      jobService.payJobByJobId = jest.fn(async () => undefined);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should call jobService.payJobByJobId with correct params and return status 200', async () => {
      const req = {
        profile: {
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        },
        params: { jobId: 'jobId' }
      };
      const res = mockResponse();

      await jobsController.payJobByJobId(req, res);

      expect(jobService.payJobByJobId).toHaveBeenCalledWith('jobId', {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('When the payment cant be done', () => {
    beforeEach(() => {
      jobService.payJobByJobId = jest.fn(async () => {
        throw new Error('DB Error');
      });
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should not throw exception, just status 500', async () => {
      const req = {
        profile: {
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 1150,
          type: 'client',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        },
        params: { jobId: 'jobId' }
      };
      const res = mockResponse();

      await jobsController.payJobByJobId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.end).toHaveBeenCalled();
    });
  });
});
