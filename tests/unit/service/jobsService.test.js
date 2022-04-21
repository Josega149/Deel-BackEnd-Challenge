const jobService = require('../../../src/service/jobService');
const jobRepository = require('../../../src/repository/jobRepository');
const contractRepository = require('../../../src/repository/contractRepository');
const profileRepository = require('../../../src/repository/profileRepository');
const { sequelize } = require('../../../src/model');

describe('getUnpaidJobs by profile', () => {
  describe('When profile is defined', () => {
    beforeEach(() => {
      jobRepository.getUnpaidJobsByProfileId = jest.fn(async () => [
        {
          id: 2,
          description: 'work',
          price: 201,
          paid: null,
          paymentDate: null,
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractId: 2,
          Contract: {
            id: 2,
            terms: 'bla bla bla',
            status: 'in_progress',
            createdAt: '2022-04-20T01:31:42.916Z',
            updatedAt: '2022-04-20T01:31:42.916Z',
            ContractorId: 6,
            ClientId: 1
          }
        }
      ]);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should call jobRepository.getUnpaidJobsByProfileId with correct params and return correctly', async () => {
      const profile = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      };
      const unpaidJobs = await jobService.getUnpaidJobsByProfile(profile);

      expect(jobRepository.getUnpaidJobsByProfileId).toHaveBeenCalledWith(1);
      expect(unpaidJobs).toStrictEqual([
        {
          id: 2,
          description: 'work',
          price: 201,
          paid: null,
          paymentDate: null,
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractId: 2,
          Contract: {
            id: 2,
            terms: 'bla bla bla',
            status: 'in_progress',
            createdAt: '2022-04-20T01:31:42.916Z',
            updatedAt: '2022-04-20T01:31:42.916Z',
            ContractorId: 6,
            ClientId: 1
          }
        }
      ]);
    });
  });
});

describe('payJobByJobId by profile and jobId', () => {
  describe('When the payment can be done', () => {
    const mockTransaction = {};
    beforeEach(() => {
      jobRepository.getJobById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          description: 'work',
          price: 200,
          paid: null,
          paymentDate: null,
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractId: 2
        }
      }));
      contractRepository.getContractById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          terms: 'bla bla bla',
          status: 'in_progress',
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractorId: 6,
          ClientId: 1
        }
      }));
      profileRepository.getProfileById = jest.fn().mockReturnValueOnce({
        balance: 2200,
        dataValues: {
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 2200,
          type: 'client',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      }).mockReturnValueOnce({
        balance: 1000,
        dataValues: {
          id: 6,
          firstName: 'Linus',
          lastName: 'Torwalds',
          profession: 'Developer',
          balance: 1000,
          type: 'contractor',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      });
      profileRepository.upsertProfile = jest.fn(async () => undefined);
      jobRepository.upsertJob = jest.fn(async () => undefined);
      sequelize.transaction = jest.fn().mockImplementation((cb) => cb(mockTransaction));
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should call all repositories with correct params and dont throw any exception', async () => {
      const profile = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      };

      await jobService.payJobByJobId('jobId', profile);

      expect(jobRepository.getJobById).toHaveBeenCalledWith('jobId', mockTransaction);
      expect(contractRepository.getContractById).toHaveBeenCalledWith(2, mockTransaction);
      expect(profileRepository.getProfileById).toHaveBeenNthCalledWith(1, 1, mockTransaction);
      expect(profileRepository.getProfileById).toHaveBeenNthCalledWith(2, 6, mockTransaction);
      expect(profileRepository.upsertProfile).toHaveBeenNthCalledWith(1, {
        balance: 1200,
        dataValues: {
          id: 6,
          firstName: 'Linus',
          lastName: 'Torwalds',
          profession: 'Developer',
          balance: 1000,
          type: 'contractor',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      }, mockTransaction);
      expect(profileRepository.upsertProfile).toHaveBeenNthCalledWith(2, {
        balance: 2000,
        dataValues: {
          balance: 2200,
          createdAt: '2022-04-20T01:31:42.914Z',
          firstName: 'Harry',
          id: 1,
          lastName: 'Potter',
          profession: 'Wizard',
          type: 'client',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      }, mockTransaction);
      expect(jobRepository.upsertJob).toHaveBeenCalledWith(expect.objectContaining({ paid: true }), mockTransaction);
    });
  });

  describe('When the payment cant be done because the job does not exist', () => {
    beforeEach(() => {
      sequelize.transaction = jest.fn().mockImplementation((cb) => cb());
      jobRepository.getJobById = jest.fn(async () => undefined);
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should throw exception with correct message', async () => {
      const profile = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      };
      await expect(jobService.payJobByJobId('jobId', profile)).rejects.toThrow(
        new Error('Job with id: jobId does not exist.')
      );
    });
  });

  describe('When the payment cant be done because the balance is not enough', () => {
    beforeEach(() => {
      sequelize.transaction = jest.fn().mockImplementation((cb) => cb());
      jobRepository.getJobById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          description: 'work',
          price: 200,
          paid: null,
          paymentDate: null,
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractId: 2
        }
      }));
      contractRepository.getContractById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          terms: 'bla bla bla',
          status: 'in_progress',
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractorId: 6,
          ClientId: 1
        }
      }));
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should throw exception with correct message', async () => {
      const profile = {
        id: 10,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      };
      await expect(jobService.payJobByJobId('jobId', profile)).rejects.toThrow(
        new Error('Profile with id: 10 is not the client for the job: jobId.')
      );
    });
  });

  describe('When the payment cant be done because the job is already paid', () => {
    beforeEach(() => {
      sequelize.transaction = jest.fn().mockImplementation((cb) => cb());
      jobRepository.getJobById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          description: 'work',
          price: 200,
          paid: true,
          paymentDate: null,
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractId: 2
        }
      }));
      contractRepository.getContractById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          terms: 'bla bla bla',
          status: 'in_progress',
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractorId: 6,
          ClientId: 1
        }
      }));
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should throw exception with correct message', async () => {
      const profile = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      };
      await expect(jobService.payJobByJobId('jobId', profile)).rejects.toThrow(
        new Error('Job with id: jobId is already paid.')
      );
    });
  });

  describe('When the payment cant be done because the profile is not the client', () => {
    beforeEach(() => {
      sequelize.transaction = jest.fn().mockImplementation((cb) => cb());
      jobRepository.getJobById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          description: 'work',
          price: 20000,
          paid: null,
          paymentDate: null,
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractId: 2
        }
      }));
      contractRepository.getContractById = jest.fn(async () => ({
        dataValues: {
          id: 2,
          terms: 'bla bla bla',
          status: 'in_progress',
          createdAt: '2022-04-20T01:31:42.916Z',
          updatedAt: '2022-04-20T01:31:42.916Z',
          ContractorId: 6,
          ClientId: 1
        }
      }));
      profileRepository.getProfileById = jest.fn().mockReturnValueOnce({
        balance: 2200,
        dataValues: {
          id: 1,
          firstName: 'Harry',
          lastName: 'Potter',
          profession: 'Wizard',
          balance: 2200,
          type: 'client',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      }).mockReturnValueOnce({
        balance: 1000,
        dataValues: {
          id: 6,
          firstName: 'Linus',
          lastName: 'Torwalds',
          profession: 'Developer',
          balance: 1000,
          type: 'contractor',
          createdAt: '2022-04-20T01:31:42.914Z',
          updatedAt: '2022-04-20T01:31:42.914Z'
        }
      });
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    test('Should throw exception with correct message', async () => {
      const profile = {
        id: 1,
        firstName: 'Harry',
        lastName: 'Potter',
        profession: 'Wizard',
        balance: 1150,
        type: 'client',
        createdAt: '2022-04-20T01:31:42.914Z',
        updatedAt: '2022-04-20T01:31:42.914Z'
      };
      await expect(jobService.payJobByJobId('jobId', profile)).rejects.toThrow(
        new Error('Client balance (2200) cannot be less than job price (20000).')
      );
    });
  });
});
