// firebase-db.js - Fixed version with complete config

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { 
  getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy 
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  authDomain: "deca-website-bbdde.firebaseapp.com",
  projectId: "deca-website-bbdde",
  storageBucket: "deca-website-bbdde.firebasestorage.app",
  messagingSenderId: "250384270438",
  appId: "1:250384270438:web:f56f1e484c6c155b2e99a7"
};

// Add error handling for initialization
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

// Universal Firebase Helper
window.FirebaseDB = {
  // MEMBERS FUNCTIONS
  async getMembers() {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const snapshot = await getDocs(collection(db, "members"));
      const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return members;
    } catch (error) {
      console.error('Error getting members:', error);
      throw error;  // Re-throw to show error in UI
    }
  },

  async addMember(memberData) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const docRef = await addDoc(collection(db, "members"), {
        ...memberData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...memberData };
    } catch (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  },

  async updateMember(id, updatedData) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const memberRef = doc(db, "members", id);
      await updateDoc(memberRef, updatedData);
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  },

  async deleteMember(id) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const memberRef = doc(db, "members", id);
      await deleteDoc(memberRef);
    } catch (error) {
      console.error("Error deleting member:", error);
      throw error;
    }
  },

  // MINUTES FUNCTIONS
  async getMinutes() {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const q = query(collection(db, "minutes"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const minutes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return minutes;
    } catch (error) {
      console.error('Error getting minutes:', error);
      throw error;
    }
  },

  async addMinutes(minutesData) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const docRef = await addDoc(collection(db, "minutes"), {
        ...minutesData,
        timestamp: new Date().toISOString()
      });
      return { id: docRef.id, ...minutesData };
    } catch (error) {
      console.error('Error adding minutes:', error);
      throw error;
    }
  },

  // ATTENDANCE FUNCTIONS
  async getAttendanceRecords() {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const attendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return attendance;
    } catch (error) {
      console.error('Error getting attendance:', error);
      throw error;
    }
  },

  async addAttendanceRecord(attendanceData) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const docRef = await addDoc(collection(db, "attendance"), {
        ...attendanceData,
        timestamp: new Date().toISOString()
      });
      return { id: docRef.id, ...attendanceData };
    } catch (error) {
      console.error('Error adding attendance record:', error);
      throw error;
    }
  },

  // Delete attendance records by date and meetingType (client-side filter)
  async deleteAttendanceByDateAndType(date, meetingType) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const toDelete = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(r => r.date === date && (meetingType ? r.meetingType === meetingType : true));

      for (const rec of toDelete) {
        const ref = doc(db, "attendance", rec.id);
        await deleteDoc(ref);
      }

      return toDelete.length;
    } catch (error) {
      console.error('Error deleting attendance by date/type:', error);
      throw error;
    }
  },

  // POINTS FUNCTIONS
  async getPoints() {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const q = query(collection(db, "points"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const points = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return points;
    } catch (error) {
      console.error('Error getting points:', error);
      throw error;
    }
  },

  async addPoints(pointsData) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const docRef = await addDoc(collection(db, "points"), {
        ...pointsData,
        timestamp: new Date().toISOString()
      });
      return { id: docRef.id, ...pointsData };
    } catch (error) {
      console.error('Error adding points record:', error);
      throw error;
    }
  },

  // POINTS HISTORY (for backward compatibility)
  async getPointsHistory() {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }
      const q = query(collection(db, "points"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const points = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return points;
    } catch (error) {
      console.error('Error getting points history:', error);
      return [];
    }
  },

  // POINTS DATA (alias for getPoints)
  async getPointsData() {
    return this.getPoints();
  },

  // UPDATE MEMBER POINTS
  async updateMemberPoints(memberId, points) {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, { points: points });
    } catch (error) {
      console.error("Error updating member points:", error);
      throw error;
    }
  },

  // COMBINED DATA FUNCTIONS
  async getMemberPointsSummary() {
    try {
      const [members, attendance, points] = await Promise.all([
        this.getMembers(),
        this.getAttendanceRecords(),
        this.getPoints()
      ]);

      // Create maps for quick lookup by id and by name
      const memberIdMap = {};
      const memberNameMap = {};
      members.forEach(member => {
        if (member && member.id) {
          memberIdMap[member.id] = member;
        }
        if (member && member.name && typeof member.name === 'string' && member.name.trim()) {
          memberNameMap[member.name.toLowerCase().trim()] = member;
        }
      });

      // Calculate points for each member
      const memberPoints = {};
      
      // Add attendance points (prefer matching by memberId, fallback to name)
      attendance.forEach(record => {
        let targetMember = null;
        if (record.memberId && memberIdMap[record.memberId]) {
          targetMember = memberIdMap[record.memberId];
        } else if (record.name && typeof record.name === 'string' && record.name.trim()) {
          const memberName = record.name.toLowerCase().trim();
          targetMember = memberNameMap[memberName] || null;
        }

        if (targetMember) {
          if (!memberPoints[targetMember.id]) {
            memberPoints[targetMember.id] = {
              ...targetMember,
              totalPoints: 0,
              attendancePoints: 0,
              adjustmentPoints: 0
            };
          }
          memberPoints[targetMember.id].attendancePoints += record.points || 0;
          memberPoints[targetMember.id].totalPoints += record.points || 0;
        }
      });

      // Add manual points adjustments (matched by memberId)
      points.forEach(record => {
        const member = record.memberId ? memberIdMap[record.memberId] : null;
        if (!member) {
          return;
        }
        if (!memberPoints[record.memberId]) {
          memberPoints[record.memberId] = {
            ...member,
            totalPoints: 0,
            attendancePoints: 0,
            adjustmentPoints: 0
          };
        }
        memberPoints[record.memberId].adjustmentPoints += record.points || 0;
        memberPoints[record.memberId].totalPoints += record.points || 0;
      });

      // Convert to array and include members with 0 points
      const result = members.map(member => {
        if (memberPoints[member.id]) {
          return memberPoints[member.id];
        } else {
          return {
            ...member,
            totalPoints: 0,
            attendancePoints: 0,
            adjustmentPoints: 0
          };
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting member points summary:', error);
      throw error;
    }
  },

  async getMemberAttendanceRecords() {
    try {
      const [members, attendance] = await Promise.all([
        this.getMembers(),
        this.getAttendanceRecords()
      ]);

      // Create a map of member names for validation (filter out invalid names)
      const validMemberNames = new Set();
      members.forEach(member => {
        if (member.name && typeof member.name === 'string' && member.name.trim()) {
          validMemberNames.add(member.name.toLowerCase().trim());
        }
      });

      // Filter attendance to only include valid members
      const validAttendance = attendance.filter(record => {
        if (!record.name || typeof record.name !== 'string' || !record.name.trim()) {
          return false;
        }
        return validMemberNames.has(record.name.toLowerCase().trim());
      });

      return validAttendance;
    } catch (error) {
      console.error('Error getting member attendance records:', error);
      throw error;
    }
  },

  // Test connection function
  async testConnection() {
    try {
      if (!db) throw new Error('Firebase not initialized');
      const testQuery = await getDocs(collection(db, "members"));
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
};

window.firebaseReady = true;
window.dispatchEvent(new Event('firebaseReady'));
