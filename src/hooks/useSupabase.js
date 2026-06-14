import { useEffect } from "react";
import { KEYS, DEFAULT_FILINGS } from "../config/keys.js";

// Load all data from Supabase on mount
export function useDataLoader(db, {
  setCompliance, setVehicles, setDrivers, setMaintenance, setExpenses, setRevenue,
  setRoutes, setContracts, setIncidents, setBrokers, setLoads, setUsers, setCurrentUser,
  setNotifications, setFilings, setPayroll, setFuelLog, setInvoices, setOdometer,
  setTires, setDocuments, setDispatches, setContacts, setHosLog,
  setStopProfitLog, setSettlementLog, setScheduleData, setCoachingLog, setAppearanceLog,
  setDnrLog, setTripSheets, setVanInspectionLog, setBidTracker, setDeadMilesLog, setLoadHistory,
  setWhiteGloveLog, setCalloutLog, setDamageClaims, setFuelCardImports, setDbLoaded,
}) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const D = KEYS;
      const [
        _compliance, _vehicles, _drivers, _maintenance, _expenses, _revenue,
        _routes, _contracts, _incidents, _brokers, _loads, _users, _currentUser,
        _notifications, _filings, _payroll, _fuelLog, _invoices, _odometer,
        _tires, _documents, _dispatches, _contacts, _hosLog,
        _stopProfitLog, _settlementLog, _scheduleData, _coachingLog, _appearanceLog,
        _dnrLog, _tripSheets, _vanInspectionLog, _bidTracker, _deadMilesLog, _loadHistory, _whiteGloveLog,
        _calloutLog, _damageClaims, _fuelCardImports,
      ] = await Promise.all([
        db.get(D.compliance,  {trucks:[],drivers:[]}),
        db.get(D.vehicles,    []),
        db.get(D.drivers,     []),
        db.get(D.maintenance, []),
        db.get(D.expenses,    []),
        db.get(D.revenue,     []),
        db.get(D.routes,      []),
        db.get(D.contracts,   []),
        db.get(D.incidents,   []),
        db.get(D.brokers,     []),
        db.get(D.loads,       []),
        db.get(D.users,       []),
        db.get(D.currentUser, {id:"owner",name:"Owner",role:"owner",pin:""}),
        db.get(D.notifications, []),
        db.get(D.filings,     null),
        db.get(D.payroll,     []),
        db.get(D.fuelLog,     []),
        db.get(D.invoices,    []),
        db.get(D.odometer,    []),
        db.get(D.tires,       []),
        db.get(D.documents,   []),
        db.get(D.dispatches,  []),
        db.get(D.contacts,    []),
        db.get(D.hosLog,      []),
        db.get(D.stopProfitLog, []),
        db.get(D.settlementLog, []),
        db.get(D.scheduleData, {}),
        db.get(D.coachingLog, []),
        db.get(D.appearanceLog, []),
        db.get(D.dnrLog, []),
        db.get(D.tripSheets, []),
        db.get(D.vanInspectionLog, []),
        db.get(D.bidTracker, []),
        db.get(D.deadMilesLog, []),
        db.get(D.loadHistory, []),
        db.get(D.whiteGloveLog, []),
        db.get(D.calloutLog, []),
        db.get(D.damageClaims, []),
        db.get(D.fuelCardImports, []),
      ]);
      if (cancelled) return;
      setCompliance(_compliance);
      setVehicles(_vehicles);
      setDrivers(_drivers);
      setMaintenance(_maintenance);
      setExpenses(_expenses);
      setRevenue(_revenue);
      setRoutes(_routes);
      setContracts(_contracts);
      setIncidents(_incidents);
      setBrokers(_brokers);
      setLoads(_loads);
      setUsers(_users);
      setCurrentUser(_currentUser);
      setNotifications(_notifications);
      if (_filings) {
        const saved = _filings; const merged = [...DEFAULT_FILINGS];
        merged.forEach((f, i) => { const s = saved.find(x => x.id === f.id); if (s) { merged[i] = {...f, ...s}; } });
        saved.filter(s => !DEFAULT_FILINGS.find(f => f.id === s.id)).forEach(s => merged.push(s));
        setFilings(merged);
      }
      setPayroll(_payroll);
      setFuelLog(_fuelLog);
      setInvoices(_invoices);
      setOdometer(_odometer);
      setTires(_tires);
      setDocuments(_documents);
      setDispatches(_dispatches);
      setContacts(_contacts);
      setHosLog(_hosLog);
      setStopProfitLog(_stopProfitLog);
      setSettlementLog(_settlementLog);
      setScheduleData(_scheduleData);
      setCoachingLog(_coachingLog);
      setAppearanceLog(_appearanceLog);
      setDnrLog(_dnrLog);
      setTripSheets(_tripSheets);
      setVanInspectionLog(_vanInspectionLog);
      setBidTracker(_bidTracker);
      setDeadMilesLog(_deadMilesLog);
      setLoadHistory(_loadHistory);
      setWhiteGloveLog(_whiteGloveLog);
      setCalloutLog(_calloutLog);
      setDamageClaims(_damageClaims);
      setFuelCardImports(_fuelCardImports);
      setDbLoaded(true);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const DEBOUNCE_MS = 1500;

function useDebouncedSave(db, dbLoaded, key, value) {
  useEffect(() => {
    if (!dbLoaded) return;
    const t = setTimeout(() => db.set(key, value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, dbLoaded]);
}

// Save all state to cloud whenever it changes (debounced 1500ms)
export function useDataSaver(db, dbLoaded, state) {
  useDebouncedSave(db, dbLoaded, KEYS.compliance, state.compliance);
  useDebouncedSave(db, dbLoaded, KEYS.vehicles, state.vehicles);
  useDebouncedSave(db, dbLoaded, KEYS.drivers, state.drivers);
  useDebouncedSave(db, dbLoaded, KEYS.maintenance, state.maintenance);
  useDebouncedSave(db, dbLoaded, KEYS.expenses, state.expenses);
  useDebouncedSave(db, dbLoaded, KEYS.revenue, state.revenue);
  useDebouncedSave(db, dbLoaded, KEYS.routes, state.routes);
  useDebouncedSave(db, dbLoaded, KEYS.contracts, state.contracts);
  useDebouncedSave(db, dbLoaded, KEYS.incidents, state.incidents);
  useDebouncedSave(db, dbLoaded, KEYS.brokers, state.brokers);
  useDebouncedSave(db, dbLoaded, KEYS.loads, state.loads);
  useDebouncedSave(db, dbLoaded, KEYS.users, state.users);
  useDebouncedSave(db, dbLoaded, KEYS.currentUser, state.currentUser);
  useDebouncedSave(db, dbLoaded, KEYS.notifications, state.notifications);
  useDebouncedSave(db, dbLoaded, KEYS.filings, state.filings);
  useDebouncedSave(db, dbLoaded, KEYS.payroll, state.payroll);
  useDebouncedSave(db, dbLoaded, KEYS.fuelLog, state.fuelLog);
  useDebouncedSave(db, dbLoaded, KEYS.invoices, state.invoices);
  useDebouncedSave(db, dbLoaded, KEYS.odometer, state.odometer);
  useDebouncedSave(db, dbLoaded, KEYS.tires, state.tires);
  useDebouncedSave(db, dbLoaded, KEYS.documents, state.documents);
  useDebouncedSave(db, dbLoaded, KEYS.dispatches, state.dispatches);
  useDebouncedSave(db, dbLoaded, KEYS.contacts, state.contacts);
  useDebouncedSave(db, dbLoaded, KEYS.hosLog, state.hosLog);
  useDebouncedSave(db, dbLoaded, KEYS.stopProfitLog, state.stopProfitLog);
  useDebouncedSave(db, dbLoaded, KEYS.settlementLog, state.settlementLog);
  useDebouncedSave(db, dbLoaded, KEYS.scheduleData, state.scheduleData);
  useDebouncedSave(db, dbLoaded, KEYS.coachingLog, state.coachingLog);
  useDebouncedSave(db, dbLoaded, KEYS.appearanceLog, state.appearanceLog);
  useDebouncedSave(db, dbLoaded, KEYS.dnrLog, state.dnrLog);
  useDebouncedSave(db, dbLoaded, KEYS.tripSheets, state.tripSheets);
  useDebouncedSave(db, dbLoaded, KEYS.vanInspectionLog, state.vanInspectionLog);
  useDebouncedSave(db, dbLoaded, KEYS.bidTracker, state.bidTracker);
  useDebouncedSave(db, dbLoaded, KEYS.deadMilesLog, state.deadMilesLog);
  useDebouncedSave(db, dbLoaded, KEYS.loadHistory, state.loadHistory);
  useDebouncedSave(db, dbLoaded, KEYS.whiteGloveLog, state.whiteGloveLog);
  useDebouncedSave(db, dbLoaded, KEYS.calloutLog, state.calloutLog);
  useDebouncedSave(db, dbLoaded, KEYS.damageClaims, state.damageClaims);
  useDebouncedSave(db, dbLoaded, KEYS.fuelCardImports, state.fuelCardImports);
}
