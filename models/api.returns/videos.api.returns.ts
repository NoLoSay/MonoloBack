import {
  VideoAdminDbReturn,
  VideoCommonDbReturn,
  VideoCreatorDbReturn,
  VideoDefaultDbReturn,
  VideoManagerDbReturn,
  VideoModeratorDbReturn,
} from '@noloback/db.returns';

class User {
  id: number = 0;
  username: string = '';
  picture: string | null = null;
}

class Picture {
  id: number = 0;
  uuid: string = '';
  hostingUrl: string = '';
}

class Item {
  id: number = 0;
  uuid: string = '';
  name: string = '';
  pictures: Picture[] = [];
}

abstract class VideoDefaultReturn {
  id: number = 0;
  uuid: string = '';
  duration: number = 0;
  hostingProviderId: number = 0;
  hostingProviderVideoId: string = '';
  validationStatus: string = '';
  createdAt: Date = new Date();
  likedBy: User[] = [];
  item: Item | undefined = undefined;
  showcased: boolean = false;
  postedBy: User | undefined = undefined;

  constructor(dbReturn: VideoDefaultDbReturn) {
    this.id = dbReturn.id;
    this.uuid = dbReturn.uuid;
    this.duration = dbReturn.duration;
    this.hostingProviderId = dbReturn.hostingProviderId;
    this.hostingProviderVideoId = dbReturn.hostingProviderVideoId;
    this.validationStatus = dbReturn.validationStatus;
    this.createdAt = dbReturn.createdAt;
    this.likedBy = dbReturn.likedBy.map((like) => like.User);
    this.item = dbReturn.item ?? undefined;
    this.showcased = dbReturn.showcased;
    this.postedBy = dbReturn.postedBy?.user ?? undefined;
  }
}

// Single video

export class VideoCommonReturn extends VideoDefaultReturn {
  constructor(dbReturn: VideoCommonDbReturn) {
    super(dbReturn);
  }
}

// ----- LISTS -----

// export class VideoFromItemCommonReturn extends VideoDefaultReturn {
//   constructor (dbReturn: VideoFromItemCommonDbReturn) {
//     super(dbReturn)
//   }
// }

// export class VideoFromUserCommonReturn extends VideoDefaultReturn {
//   constructor (dbReturn: VideoFromUserCommonDbReturn) {
//     super(dbReturn)
//   }
// }

// Generalize the return of a video

export class VideoManagerReturn extends VideoDefaultReturn {
  // validationStatus: string = ''

  constructor(dbReturn: VideoManagerDbReturn) {
    super(dbReturn);
    this.validationStatus = dbReturn.validationStatus;
  }
}

export class VideoCreatorReturn extends VideoManagerReturn {
  deletedAt: Date | null = null;
  deletedReason: string | null = null;
  constructor(dbReturn: VideoCreatorDbReturn) {
    super(dbReturn);
    this.deletedAt = dbReturn.deletedAt;
    this.deletedReason = dbReturn.deletedReason;
  }
}

export class VideoModeratorReturn extends VideoCreatorReturn {
  constructor(dbReturn: VideoModeratorDbReturn) {
    super(dbReturn);
  }
}

export class VideoAdminReturn extends VideoModeratorReturn {
  updatedAt: Date = new Date();

  constructor(dbReturn: VideoAdminDbReturn) {
    super(dbReturn);
    this.updatedAt = dbReturn.updatedAt;
  }
}
