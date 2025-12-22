# SVA LMS - Offline-First Architecture

## Vision

**"Weeks without internet cannot mean weeks without learning."**

SVA is designed for Ghana, where power and internet can disappear for weeks. The village must keep functioning because it is FOR people in disruption.

## Core Principles

### 1. Local-First Data Architecture
- All student interactions write locally first (IndexedDB/SQLite)
- No data loss during connectivity outages
- Background sync when connectivity available
- Conflict resolution: last-write-wins with manual review for critical data

### 2. Content Packages
- Course versions packaged as downloadable offline bundles
- Includes: all lesson content, assets, assessments
- Tiered packages:
  - **Minimal**: Text-only (low bandwidth)
  - **Standard**: Text + Audio
  - **Full**: Text + Audio + Video
- Checksum verification for integrity

### 3. Sync Nodes
Three deployment models supported:

**Learning Center**:
- Dedicated container with local server
- Solar + battery backup (4-6 hours minimum)
- Full offline capability
- Sync during connectivity windows

**Internet Café Partnership**:
- SVA content on existing café computers
- Shared infrastructure
- Scheduled time slots for students
- Sync during café hours

**Mobile Unit**:
- Vehicle-based deployment to remote areas
- Periodic visits
- Content sync on arrival
- Teacher conducts sessions, leaves materials

## Schema Design

### syncNodes
Tracks each deployment location:
- `nodeType`: learning_center | mobile_unit | cafe_partner
- `syncStatus`: synced | pending | conflict
- `localDbVersion`: Version tracking for conflict detection
- `lastSyncAt`: Last successful sync timestamp

### contentPackages
Offline bundles for course versions:
- `packageVersion`: Incremental versioning
- `sizeMb`: Package size for bandwidth planning
- `checksum`: Integrity verification
- `downloadUrl`: Primary download location
- `minimalPackageUrl`: Text-only variant for low bandwidth

### offlineSubmissions
Student work created offline:
- `localId`: UUID generated offline (prevents collisions)
- `syncNodeId`: Which node created this
- `syncStatus`: pending | synced | conflict
- `conflictResolution`: Manual resolution data if conflicts occur

## Sync Protocol

### Bidirectional Sync
1. **Push Local Changes**:
   - Offline submissions
   - Teacher feedback
   - Progress events
   - Mastery updates

2. **Pull Remote Changes**:
   - New content packages
   - Lesson assignments
   - System updates
   - Teacher communications

### Conflict Resolution Strategy

**Simple (Last-Write-Wins)**:
- Progress events
- View timestamps
- Non-critical updates

**Manual Review**:
- Student submissions
- Assessment attempts
- Mastery records
- Teacher feedback

**Conflict Detection**:
- Compare `localDbVersion` with server version
- Flag conflicts in `offlineSubmissions.syncStatus`
- Queue for human review

## Implementation Phases

### Phase 1: Schema + Content Packaging
- ✅ Schema implemented
- ⚠️ Content package generator (pending)
- ⚠️ Download infrastructure (pending)

### Phase 2: Local Storage
- ⚠️ IndexedDB/SQLite client storage
- ⚠️ Local-first write patterns
- ⚠️ Offline queue management

### Phase 3: Sync Engine
- ⚠️ Bidirectional sync protocol
- ⚠️ Conflict resolution UI
- ⚠️ Partial sync handling (interrupted connections)

### Phase 4: Offline UI
- ⚠️ Offline teacher dashboard
- ⚠️ Offline student interface
- ⚠️ Sync status indicators

## Ghana Infrastructure Reality

### Connectivity Patterns

**Urban (Takoradi center)**:
- Intermittent: 4-8 hours daily
- Sync during available windows
- Partial sync acceptable

**Peri-urban**:
- Unreliable: Days without connectivity common
- Full offline capability required
- Weekly sync windows

**Rural**:
- Weeks offline possible
- Content must be fully pre-loaded
- Sync via occasional town visits

### Power Patterns

**Grid Power**:
- Subject to "dumsor" (load shedding)
- Unpredictable outages: hours to days
- Battery backup essential

**Container Centers**:
- Battery backup: 4-6 hours minimum
- Solar option for extended operation
- Device charging infrastructure

**Device Charging**:
- Students may not charge at home
- Centers must provide charging
- Power-efficient device usage

### Device Landscape

**Primary Devices**:
- Budget Android phones (most common)
- Shared tablets at learning centers
- Occasional laptops

**Screen Sizes**:
- UI must work on 5-inch phone screens
- Primary interface optimized for mobile
- Desktop as enhancement

**Storage**:
- Limited device storage
- Offline packages size-optimized
- Text-only variants available

## Success Criteria

### Technical Acceptance
- ✅ Learning center operates fully offline for 14+ days without data loss
- ✅ Sync completes successfully after extended offline period
- ✅ UI functions on 5-inch Android phone with acceptable performance
- ✅ Content packages downloadable on 3G connection within reasonable time

### Operational Acceptance
- ✅ Teacher can view student progress offline
- ✅ Teacher can provide feedback offline
- ✅ Student can submit work offline
- ✅ All work preserved during outages
- ✅ Sync queue visible and manageable

## Risk Mitigation

### Technical Risks

**Offline Sync Complexity**:
- Start with simple last-write-wins
- Add manual review for critical data
- Progressive enhancement

**Content Package Size**:
- Tiered packages (text-only, audio, full)
- Progressive download
- Compression optimization

**Device Fragmentation**:
- Target Android 8+ (covers 95% of devices)
- Progressive enhancement
- Graceful degradation

### Operational Risks

**Power Outages**:
- Battery backup systems
- Solar options
- Power-efficient design

**Connectivity Loss**:
- Full offline capability
- Sync queue management
- Conflict resolution workflows

## Next Steps

1. **Content Package Generator**: Script to bundle course versions
2. **Local Storage Layer**: IndexedDB/SQLite implementation
3. **Sync Engine**: Bidirectional sync protocol
4. **Offline UI**: Teacher and student offline interfaces
5. **Testing**: 14-day offline operation test

---

**Status**: Schema complete, implementation pending
**Priority**: CRITICAL for Ghana deployment
**Version**: 2.0.0

